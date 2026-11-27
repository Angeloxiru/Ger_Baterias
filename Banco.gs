/**
 * Banco.gs - Envio das trocas de bateria para o banco de dados Turso (sistema Ger_Tarefas)
 *
 * O registro continua igual (QR code -> planilha). Depois de gravar a troca na aba
 * Registros, uma copia e enviada ao banco do app Tarefas, onde cada troca soma 15 minutos
 * ao tempo trabalhado do funcionario e aparece no Historico e no Raio X.
 *
 * - Se o envio falhar (internet, banco fora do ar), a troca CONTINUA registrada na planilha.
 * - A coluna "Enviado ao banco" (J) da aba Registros guarda quando cada troca foi enviada.
 * - sincronizarBanco() roda a cada 15 minutos e envia o que ficou pendente (inclusive todo o
 *   historico na primeira vez), alem de copiar as abas Equipamentos e Baterias.
 * - Enviar a mesma troca de novo nao duplica: a chave e data/hora + empilhadeira.
 *
 * Configuracao (uma vez): Configuracoes do projeto > Propriedades do script:
 *   TURSO_URL   = libsql://tarefas-angeloxiru.aws-us-east-1.turso.io
 *   TURSO_TOKEN = (token do banco)
 * Depois execute configurarSincronizacao() no editor.
 */

var BANCO = {
  COLUNA_ENVIADO: 10,          // J
  LOTE: 100,                   // trocas por requisicao
  MINUTOS_CREDITADOS: 15
};

function _bancoConfig() {
  var p = PropertiesService.getScriptProperties();
  var url = (p.getProperty('TURSO_URL') || '').trim();
  var token = (p.getProperty('TURSO_TOKEN') || '').trim();
  if (!url || !token) return null;
  return { url: url.replace(/^libsql:\/\//, 'https://').replace(/\/+$/, ''), token: token };
}

function _bancoArg(v) {
  if (v === null || v === undefined || v === '') return { type: 'null' };
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { type: 'integer', value: String(v) } : { type: 'float', value: v };
  }
  return { type: 'text', value: String(v) };
}

/** Executa comandos SQL numa transacao (tudo ou nada). Lanca erro se falhar. */
function _bancoExecutar(comandos) {
  var cfg = _bancoConfig();
  if (!cfg) throw new Error('Banco nao configurado (TURSO_URL / TURSO_TOKEN nas propriedades do script).');
  var steps = [{ stmt: { sql: 'BEGIN' } }];
  comandos.forEach(function (c, i) {
    steps.push({ stmt: { sql: c[0], args: c[1].map(_bancoArg) }, condition: { type: 'ok', step: i } });
  });
  var n = comandos.length;
  steps.push({ stmt: { sql: 'COMMIT' }, condition: { type: 'ok', step: n } });
  steps.push({ stmt: { sql: 'ROLLBACK' }, condition: { type: 'not', cond: { type: 'ok', step: n + 1 } } });

  var resp = UrlFetchApp.fetch(cfg.url + '/v2/pipeline', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.token },
    payload: JSON.stringify({ requests: [{ type: 'batch', batch: { steps: steps } }, { type: 'close' }] }),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    throw new Error('Banco respondeu HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText().slice(0, 200));
  }
  var r = JSON.parse(resp.getContentText()).results[0];
  if (r.type === 'error') throw new Error(r.error.message);
  var erros = r.response.result.step_errors;
  for (var i = 1; i <= n + 1; i++) {
    if (erros[i]) throw new Error(erros[i].message);
  }
}

function _bancoIso(v) {
  if (v === null || v === undefined || v === '') return null;
  var d = (v instanceof Date) ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function _bancoNumero(v) {
  if (v === null || v === undefined || v === '') return null;
  var n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? null : n;
}

/** Comando de gravacao (insere ou atualiza) de uma linha da aba Registros. */
function _bancoComandoTroca(linha) {
  var dataHora = _bancoIso(linha[1]);
  var empilhadeira = String(linha[3] || '').trim().toUpperCase();
  if (!dataHora || !empilhadeira || !String(linha[2] || '').trim()) return null;
  var removida = String(linha[5] || '').trim();
  if (!removida || removida.toUpperCase() === 'N/A') removida = null;
  return [
    'INSERT INTO bat_trocas (id_troca, id_planilha, data_hora, codigo_func, empilhadeira, bateria_instalada, bateria_removida, ' +
    'nivel_agua, duracao_uso_anterior_h, horimetro, minutos_creditados, origem, recebido_em) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
    'ON CONFLICT(id_troca) DO UPDATE SET id_planilha = excluded.id_planilha, codigo_func = excluded.codigo_func, ' +
    'bateria_instalada = excluded.bateria_instalada, bateria_removida = excluded.bateria_removida, nivel_agua = excluded.nivel_agua, ' +
    'duracao_uso_anterior_h = excluded.duracao_uso_anterior_h, horimetro = excluded.horimetro, recebido_em = excluded.recebido_em',
    [dataHora + '|' + empilhadeira, _bancoNumero(linha[0]), dataHora, String(linha[2]).trim().toUpperCase(), empilhadeira,
     String(linha[4] || '').trim().toUpperCase() || null, removida ? removida.toUpperCase() : null, String(linha[6] || '').trim() || null,
     _bancoNumero(linha[7]), _bancoNumero(linha[8]), BANCO.MINUTOS_CREDITADOS, 'apps_script', new Date().toISOString()]
  ];
}

/**
 * Envia uma troca recem-registrada. Chamado por registrarTroca().
 * Nunca lanca erro: se falhar, a rotina sincronizarBanco() reenvia depois.
 */
function enviarTrocaParaBanco(numeroLinha) {
  try {
    if (!_bancoConfig()) return false;
    var sheet = getAbas().registros;
    var linha = sheet.getRange(numeroLinha, 1, 1, BANCO.COLUNA_ENVIADO).getValues()[0];
    var cmd = _bancoComandoTroca(linha);
    if (!cmd) return false;
    _bancoExecutar([cmd]);
    sheet.getRange(numeroLinha, BANCO.COLUNA_ENVIADO).setValue(new Date());
    return true;
  } catch (e) {
    Logger.log('Envio ao banco ficou pendente (linha ' + numeroLinha + '): ' + e.message);
    return false;
  }
}

/**
 * Rotina (gatilho a cada 15 min): envia as trocas pendentes e copia Equipamentos e Baterias.
 * Na primeira execucao envia todo o historico.
 */
function sincronizarBanco() {
  if (!_bancoConfig()) { Logger.log('Banco nao configurado.'); return; }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) { Logger.log('Outra sincronizacao em andamento.'); return; }
  try {
    var abas = getAbas();
    _garantirColunaEnviado(abas.registros);

    var dados = abas.registros.getDataRange().getValues();
    var pendentes = [];
    for (var i = 1; i < dados.length; i++) {
      if (dados[i][BANCO.COLUNA_ENVIADO - 1] === '' || dados[i][BANCO.COLUNA_ENVIADO - 1] === null) {
        var cmd = _bancoComandoTroca(dados[i]);
        if (cmd) pendentes.push({ linha: i + 1, cmd: cmd });
      }
    }

    var enviadas = 0;
    var inicio = Date.now();
    for (var j = 0; j < pendentes.length; j += BANCO.LOTE) {
      if (Date.now() - inicio > 4 * 60 * 1000) break;      // deixa o resto para a proxima execucao
      var lote = pendentes.slice(j, j + BANCO.LOTE);
      _bancoExecutar(lote.map(function (p) { return p.cmd; }));
      var agora = new Date();
      lote.forEach(function (p) { abas.registros.getRange(p.linha, BANCO.COLUNA_ENVIADO).setValue(agora); });
      enviadas += lote.length;
    }

    _sincronizarCadastros(abas);
    Logger.log('Sincronizacao: ' + enviadas + ' de ' + pendentes.length + ' trocas pendentes enviadas.');
  } finally {
    lock.releaseLock();
  }
}

/** Copia as abas Equipamentos e Baterias (situacao atual) para o banco. */
function _sincronizarCadastros(abas) {
  var agora = new Date().toISOString();
  var cmds = [];
  var eq = abas.equipamentos.getDataRange().getValues();
  for (var i = 1; i < eq.length; i++) {
    var cod = String(eq[i][0] || '').trim().toUpperCase();
    if (!cod) continue;
    cmds.push(['INSERT INTO bat_empilhadeiras (codigo, bateria_atual, ultima_troca, ultimo_horimetro, atualizado_em) VALUES (?, ?, ?, ?, ?) ' +
      'ON CONFLICT(codigo) DO UPDATE SET bateria_atual = excluded.bateria_atual, ultima_troca = excluded.ultima_troca, ' +
      'ultimo_horimetro = excluded.ultimo_horimetro, atualizado_em = excluded.atualizado_em',
      [cod, String(eq[i][1] || '').trim().toUpperCase() || null, _bancoIso(eq[i][2]), _bancoNumero(eq[i][3]), agora]]);
  }
  var bt = abas.baterias.getDataRange().getValues();
  for (var k = 1; k < bt.length; k++) {
    var cb = String(bt[k][0] || '').trim().toUpperCase();
    if (!cb) continue;
    cmds.push(['INSERT INTO bat_baterias (codigo, status, localizacao, inicio_status, ultimo_nivel_agua, total_usos, media_duracao_h, horimetro_instalacao, atualizado_em) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(codigo) DO UPDATE SET status = excluded.status, localizacao = excluded.localizacao, ' +
      'inicio_status = excluded.inicio_status, ultimo_nivel_agua = excluded.ultimo_nivel_agua, total_usos = excluded.total_usos, ' +
      'media_duracao_h = excluded.media_duracao_h, horimetro_instalacao = excluded.horimetro_instalacao, atualizado_em = excluded.atualizado_em',
      [cb, String(bt[k][1] || '') || null, String(bt[k][2] || '') || null, _bancoIso(bt[k][3]), String(bt[k][5] || '') || null,
       _bancoNumero(bt[k][6]), _bancoNumero(bt[k][7]), _bancoNumero(bt[k][8]), agora]]);
  }
  if (cmds.length) _bancoExecutar(cmds);
}

function _garantirColunaEnviado(sheet) {
  var cab = sheet.getRange(1, BANCO.COLUNA_ENVIADO);
  if (cab.getValue() !== 'Enviado ao banco') {
    cab.setValue('Enviado ao banco').setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  }
}

/** Execute UMA vez no editor: cria a coluna J e o gatilho de 15 minutos, e faz a primeira sincronizacao. */
function configurarSincronizacao() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'sincronizarBanco'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('sincronizarBanco').timeBased().everyMinutes(15).create();
  _garantirColunaEnviado(getAbas().registros);
  sincronizarBanco();
}

/** Teste rapido da conexao (execute no editor e veja o registro de execucao). */
function testarConexaoBanco() {
  _bancoExecutar([['SELECT 1', []]]);
  Logger.log('Conexao com o banco OK.');
}
