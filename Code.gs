/**
 * SISTEMA DE CONTROLE DE BATERIAS DE EMPILHADEIRAS
 * 
 * Arquivo: Code.gs (Backend - Google Apps Script)
 * 
 * Este é o arquivo principal que gerencia toda a lógica do sistema.
 * Funções organizadas por módulos para facilitar manutenção.
 */

// ==================== CONFIGURAÇÕES GLOBAIS ====================

/**
 * Obtém a planilha ativa
 */
function getPlanilha() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Obtém referências de todas as abas
 */
function getAbas() {
  var ss = getPlanilha();
  return {
    registros: ss.getSheetByName('Registros'),
    baterias: ss.getSheetByName('Baterias'),
    config: ss.getSheetByName('Configurações'),
    equipamentos: ss.getSheetByName('Equipamentos')
  };
}

/**
 * Constantes do sistema
 */
var CONFIG = {
  TEMPO_CARGA_HORAS: 9.5,
  TEMPO_ALERTA_AMARELO: 7,
  CORES: {
    VERMELHO: '#ff4444',
    AMARELO: '#ffbb33',
    VERDE: '#00C851'
  }
};

// ==================== MÓDULO: INICIALIZAÇÃO ====================

/**
 * Cria a estrutura inicial da planilha
 * Execute esta função UMA VEZ ao criar o sistema
 */
function inicializarPlanilha() {
  var ss = getPlanilha();
  
  // Criar aba Registros
  criarAbaRegistros(ss);
  
  // Criar aba Baterias
  criarAbaBaterias(ss);
  
  // Criar aba Configurações
  criarAbaConfiguracoes(ss);
  
  // Criar aba Equipamentos
  criarAbaEquipamentos(ss);
  
  Logger.log('Planilha inicializada com sucesso!');
}

/**
 * Cria a aba de Registros
 */
function criarAbaRegistros(ss) {
  var sheet = ss.getSheetByName('Registros');
  if (!sheet) {
    sheet = ss.insertSheet('Registros');
  }
  
  // Cabeçalhos
  var cabecalhos = [
    'ID',
    'Data/Hora',
    'Funcionário',
    'Empilhadeira',
    'Bateria Instalada',
    'Bateria Removida',
    'Nível Água',
    'Duração Uso Anterior (horas)',
    'Horimetro'
  ];
  
  sheet.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);
  sheet.getRange(1, 1, 1, cabecalhos.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
}

/**
 * Cria a aba de Baterias (Status Atual)
 */
function criarAbaBaterias(ss) {
  var sheet = ss.getSheetByName('Baterias');
  if (!sheet) {
    sheet = ss.insertSheet('Baterias');
  }
  
  var cabecalhos = [
    'Código Bateria',
    'Status',
    'Localização',
    'Início Status',
    'Tempo Decorrido (h)',
    'Último Nível Água',
    'Total de Usos',
    'Média Duração (h)',
    'Horimetro Instalação'
  ];

  sheet.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);
  sheet.getRange(1, 1, 1, cabecalhos.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  // Inserir baterias exemplo
  var bateriasExemplo = [
    ['BAT01', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT02', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT03', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT04', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT05', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT06', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT07', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT08', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT09', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT10', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT11', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, ''],
    ['BAT12', 'Em Carga', 'Carregador', new Date(), 0, 'OK', 0, 0, '']
  ];
  
  sheet.getRange(2, 1, bateriasExemplo.length, bateriasExemplo[0].length).setValues(bateriasExemplo);
}

/**
 * Cria a aba de Configurações
 */
function criarAbaConfiguracoes(ss) {
  var sheet = ss.getSheetByName('Configurações');
  if (!sheet) {
    sheet = ss.insertSheet('Configurações');
  }
  
  var dados = [
    ['PARÂMETRO', 'VALOR'],
    ['Tempo Carga Completa (horas)', 9.5],
    ['Tempo Alerta Amarelo (horas)', 7],
    ['', ''],
    ['FUNCIONÁRIOS CADASTRADOS', ''],
    ['Código', 'Nome'],
    ['PL01', 'Funcionário 1'],
    ['PL02', 'Funcionário 2'],
    ['PL03', 'Funcionário 3'],
    ['PL04', 'Funcionário 4'],
    ['PL05', 'Funcionário 5']
  ];
  
  sheet.getRange(1, 1, dados.length, 2).setValues(dados);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  sheet.getRange(5, 1, 1, 2).setFontWeight('bold').setBackground('#34a853').setFontColor('#ffffff');
}

/**
 * Cria a aba de Equipamentos (Empilhadeiras)
 */
function criarAbaEquipamentos(ss) {
  var sheet = ss.getSheetByName('Equipamentos');
  if (!sheet) {
    sheet = ss.insertSheet('Equipamentos');
  }
  
  var dados = [
    ['Código Empilhadeira', 'Bateria Atual', 'Última Troca', 'Último Horimetro'],
    ['N01', '', '', ''],
    ['N02', '', '', ''],
    ['N03', '', '', ''],
    ['N04', '', '', ''],
    ['N05', '', '', '']
  ];

  sheet.getRange(1, 1, dados.length, 4).setValues(dados);
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
}

// ==================== MÓDULO: WEB APPS ====================

/**
 * Renderiza a página de Registro (para coletores)
 */
function doGet(e) {
  var page = e.parameter.page || 'registro';
  
  if (page === 'painel') {
    return HtmlService.createTemplateFromFile('painel')
      .evaluate()
      .setTitle('Painel de Controle - Baterias')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Registro de Troca de Bateria')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Inclui arquivos HTML externos (para modularização)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ==================== MÓDULO: VALIDAÇÃO ====================

/**
 * Valida se um código QR existe no sistema
 */
function validarCodigo(codigo, tipo) {
  var abas = getAbas();
  
  try {
    if (tipo === 'funcionario') {
      var configData = abas.config.getDataRange().getValues();
      for (var i = 6; i < configData.length; i++) {
        if (configData[i][0] === codigo) {
          return { valido: true, nome: configData[i][1] };
        }
      }
      return { valido: false, erro: 'Funcionário não cadastrado' };
    }
    
    if (tipo === 'empilhadeira') {
      var equipData = abas.equipamentos.getDataRange().getValues();
      for (var i = 1; i < equipData.length; i++) {
        if (equipData[i][0] === codigo) {
          return {
            valido: true,
            bateriaAtual: equipData[i][1] !== undefined ? equipData[i][1] : '',
            ultimoHorimetro: equipData[i][3] !== undefined ? equipData[i][3] : ''
          };
        }
      }
      return { valido: false, erro: 'Empilhadeira não cadastrada' };
    }
    
    if (tipo === 'bateria') {
      var batData = abas.baterias.getDataRange().getValues();
      for (var i = 1; i < batData.length; i++) {
        if (batData[i][0] === codigo) {
          return { 
            valido: true, 
            status: batData[i][1],
            localizacao: batData[i][2]
          };
        }
      }
      return { valido: false, erro: 'Bateria não cadastrada' };
    }
    
    return { valido: false, erro: 'Tipo de código inválido' };
  } catch (error) {
    Logger.log('Erro na validação: ' + error.toString());
    return { valido: false, erro: 'Erro ao validar código' };
  }
}

// ==================== MÓDULO: REGISTRO DE TROCA ====================

/**
 * Registra uma troca de bateria completa
 */
function registrarTroca(dados) {
  try {
    var abas = getAbas();
    var agora = new Date();

    // Validação server-side: horimetro dentro dos limites
    var equipValidData = abas.equipamentos.getDataRange().getValues();
    for (var i = 1; i < equipValidData.length; i++) {
      if (equipValidData[i][0] === dados.empilhadeira) {
        if (equipValidData[i][3] !== '' && equipValidData[i][3] !== undefined) {
          var ultimoHor = parseFloat(equipValidData[i][3]);
          if (parseFloat(dados.horimetro) <= ultimoHor) {
            return { sucesso: false, mensagem: 'Horimetro deve ser maior que ' + ultimoHor + 'h' };
          }
          if (parseFloat(dados.horimetro) > ultimoHor + 20) {
            return { sucesso: false, mensagem: 'Diferença máxima é 20h (último: ' + ultimoHor + 'h)' };
          }
        }
        break;
      }
    }

    // Validação server-side: bateria não está Em Uso
    var batValidData = abas.baterias.getDataRange().getValues();
    for (var i = 1; i < batValidData.length; i++) {
      if (batValidData[i][0] === dados.bateriaNova && batValidData[i][1] === 'Em Uso') {
        return { sucesso: false, mensagem: 'Bateria ' + dados.bateriaNova + ' já em uso em ' + batValidData[i][2] };
      }
    }

    // 1. Buscar bateria que estava na empilhadeira
    var bateriaAnterior = buscarBateriaEmpilhadeira(dados.empilhadeira);

    // 2. Calcular duração pelo horimetro (horas de máquina reais)
    var duracaoUso = 0;
    if (bateriaAnterior.codigo && bateriaAnterior.horimetroInstalacao !== '') {
      duracaoUso = dados.horimetro - bateriaAnterior.horimetroInstalacao;
      if (duracaoUso < 0) duracaoUso = 0;
    }

    // 3. Gerar ID único para o registro
    var ultimaLinha = abas.registros.getLastRow();
    var novoID = ultimaLinha > 1 ? ultimaLinha : 1;

    // 4. Inserir registro na aba Registros
    var novaLinha = [
      novoID,
      agora,
      dados.funcionario,
      dados.empilhadeira,
      dados.bateriaNova,
      bateriaAnterior.codigo || 'N/A',
      dados.nivelAgua,
      duracaoUso,
      dados.horimetro
    ];

    abas.registros.appendRow(novaLinha);

    // 5. Atualizar status da bateria antiga (vai para carga)
    if (bateriaAnterior.codigo) {
      atualizarStatusBateria(bateriaAnterior.codigo, 'Em Carga', 'Carregador', agora, duracaoUso);
    }

    // 6. Atualizar status da bateria nova (vai para uso, salva horimetro de instalação)
    atualizarStatusBateria(dados.bateriaNova, 'Em Uso', dados.empilhadeira, agora, 0, dados.nivelAgua, dados.horimetro);

    // 7. Atualizar registro da empilhadeira com horimetro atual
    atualizarEmpilhadeira(dados.empilhadeira, dados.bateriaNova, agora, dados.horimetro);

    return {
      sucesso: true,
      mensagem: 'Troca registrada com sucesso!',
      id: novoID,
      duracaoAnterior: duracaoUso.toFixed(2)
    };

  } catch (error) {
    Logger.log('Erro ao registrar troca: ' + error.toString());
    return {
      sucesso: false,
      mensagem: 'Erro ao registrar: ' + error.toString()
    };
  }
}

/**
 * Busca qual bateria está atualmente em uma empilhadeira
 */
function buscarBateriaEmpilhadeira(codigoEmpilhadeira) {
  var abas = getAbas();
  var bateriasData = abas.baterias.getDataRange().getValues();

  for (var i = 1; i < bateriasData.length; i++) {
    if (bateriasData[i][2] === codigoEmpilhadeira && bateriasData[i][1] === 'Em Uso') {
      return {
        codigo: bateriasData[i][0],
        inicioUso: bateriasData[i][3],
        horimetroInstalacao: bateriasData[i][8] !== undefined ? bateriasData[i][8] : ''
      };
    }
  }

  return { codigo: null, inicioUso: null, horimetroInstalacao: '' };
}

/**
 * Atualiza o status de uma bateria específica
 */
function atualizarStatusBateria(codigoBateria, status, localizacao, inicioStatus, duracao, nivelAgua, horimetro) {
  var abas = getAbas();
  var bateriasData = abas.baterias.getDataRange().getValues();

  for (var i = 1; i < bateriasData.length; i++) {
    if (bateriasData[i][0] === codigoBateria) {
      var totalUsos = bateriasData[i][6] || 0;
      var mediaDuracao = bateriasData[i][7] || 0;

      // Se acabou de usar, atualiza estatísticas com duração por horimetro
      if (status === 'Em Carga' && duracao > 0) {
        totalUsos++;
        mediaDuracao = ((mediaDuracao * (totalUsos - 1)) + duracao) / totalUsos;
      }

      // Atualizar linha
      abas.baterias.getRange(i + 1, 2).setValue(status);
      abas.baterias.getRange(i + 1, 3).setValue(localizacao);
      abas.baterias.getRange(i + 1, 4).setValue(inicioStatus);
      abas.baterias.getRange(i + 1, 5).setValue(0);
      if (nivelAgua) {
        abas.baterias.getRange(i + 1, 6).setValue(nivelAgua);
      }
      abas.baterias.getRange(i + 1, 7).setValue(totalUsos);
      abas.baterias.getRange(i + 1, 8).setValue(mediaDuracao);

      // Coluna 9: Horimetro Instalação — salva quando vai para uso, limpa quando vai para carga
      if (status === 'Em Uso' && horimetro !== undefined) {
        abas.baterias.getRange(i + 1, 9).setValue(horimetro);
      } else {
        abas.baterias.getRange(i + 1, 9).setValue('');
      }

      break;
    }
  }
}

/**
 * Atualiza o registro da empilhadeira
 */
function atualizarEmpilhadeira(codigoEmpilhadeira, codigoBateria, dataHora, horimetro) {
  var abas = getAbas();
  var equipData = abas.equipamentos.getDataRange().getValues();

  for (var i = 1; i < equipData.length; i++) {
    if (equipData[i][0] === codigoEmpilhadeira) {
      abas.equipamentos.getRange(i + 1, 2).setValue(codigoBateria);
      abas.equipamentos.getRange(i + 1, 3).setValue(dataHora);
      abas.equipamentos.getRange(i + 1, 4).setValue(horimetro);
      break;
    }
  }
}

/**
 * Calcula duração entre duas datas em horas
 */
function calcularDuracao(dataInicio, dataFim) {
  var diff = dataFim - new Date(dataInicio);
  return diff / (1000 * 60 * 60); // Converte para horas
}

// ==================== MÓDULO: DADOS PARA PAINEL ====================

/**
 * Retorna todos os dados para o painel de controle (chamada única agregada)
 */
function obterDadosPainel() {
  try {
    var abas = getAbas();
    var agora = new Date();

    // Atualizar tempos decorridos
    atualizarTemposDecorridos();

    // Ler todas as planilhas UMA VEZ para otimizar performance
    var bateriasData = abas.baterias.getDataRange().getValues();
    var registrosData = abas.registros.getDataRange().getValues();
    var equipamentosData = abas.equipamentos.getDataRange().getValues();
    var configData = abas.config.getDataRange().getValues();

    // Processar baterias
    var baterias = [];
    for (var i = 1; i < bateriasData.length; i++) {
      var tempoDecorrido = calcularDuracao(bateriasData[i][3], agora);

      baterias.push({
        codigo: bateriasData[i][0],
        status: bateriasData[i][1],
        localizacao: bateriasData[i][2],
        tempoDecorrido: tempoDecorrido.toFixed(2),
        nivelAgua: bateriasData[i][5],
        totalUsos: bateriasData[i][6],
        mediaDuracao: bateriasData[i][7] ? bateriasData[i][7].toFixed(2) : '0.00',
        horimetroInstalacao: bateriasData[i][8] !== undefined ? bateriasData[i][8] : ''
      });
    }

    // Processar novas seções
    var equipamentos = obterDadosEquipamentos(equipamentosData, registrosData);
    var equipe = obterDadosEquipe(configData, registrosData);
    var atividadeRecente = obterAtividadeRecente(registrosData);

    // Calcular alertas
    var aguaCritica = [];
    var cargaExcessiva = [];
    for (var j = 0; j < baterias.length; j++) {
      if (baterias[j].nivelAgua === 'CRÍTICO') {
        aguaCritica.push(baterias[j]);
      }
      if (baterias[j].status === 'Em Carga' && parseFloat(baterias[j].tempoDecorrido) > 12) {
        cargaExcessiva.push(baterias[j]);
      }
    }

    // Calcular estatísticas extras
    var alertasAgua = 0;
    for (var k = 0; k < baterias.length; k++) {
      if (baterias[k].nivelAgua === 'ATENÇÃO' || baterias[k].nivelAgua === 'CRÍTICO') {
        alertasAgua++;
      }
    }

    var trocasSemana = 0;
    for (var m = 0; m < equipe.length; m++) {
      trocasSemana += equipe[m].trocasSemana;
    }

    var empilhadeirasAtivas = 0;
    for (var n = 0; n < equipamentos.length; n++) {
      if (equipamentos[n].bateriaAtual && equipamentos[n].bateriaAtual !== '') {
        empilhadeirasAtivas++;
      }
    }

    return {
      sucesso: true,
      baterias: baterias,
      tempoCargaCompleta: CONFIG.TEMPO_CARGA_HORAS,
      tempoAlertaAmarelo: CONFIG.TEMPO_ALERTA_AMARELO,
      equipamentos: equipamentos,
      equipe: equipe,
      atividadeRecente: atividadeRecente,
      alertas: {
        aguaCritica: aguaCritica,
        cargaExcessiva: cargaExcessiva
      },
      estatisticasExtras: {
        alertasAgua: alertasAgua,
        trocasSemana: trocasSemana,
        empilhadeirasAtivas: empilhadeirasAtivas
      }
    };

  } catch (error) {
    Logger.log('Erro ao obter dados do painel: ' + error.toString());
    return {
      sucesso: false,
      erro: error.toString()
    };
  }
}

/**
 * Obtém dados das empilhadeiras com último operador
 */
function obterDadosEquipamentos(equipamentosData, registrosData) {
  var resultado = [];
  var tz = Session.getScriptTimeZone();

  for (var i = 1; i < equipamentosData.length; i++) {
    var codigo = equipamentosData[i][0];
    var ultimoOperador = '';

    // Buscar último operador no Registros (de trás para frente)
    for (var j = registrosData.length - 1; j >= 1; j--) {
      if (registrosData[j][3] === codigo) {
        ultimoOperador = registrosData[j][2];
        break;
      }
    }

    var ultimaTroca = '';
    if (equipamentosData[i][2] && equipamentosData[i][2] !== '') {
      try {
        ultimaTroca = Utilities.formatDate(new Date(equipamentosData[i][2]), tz, 'dd/MM HH:mm');
      } catch (e) {
        ultimaTroca = String(equipamentosData[i][2]);
      }
    }

    resultado.push({
      codigo: codigo,
      bateriaAtual: equipamentosData[i][1] !== undefined ? String(equipamentosData[i][1]) : '',
      ultimaTroca: ultimaTroca,
      ultimoHorimetro: equipamentosData[i][3] !== undefined && equipamentosData[i][3] !== '' ? equipamentosData[i][3] : '',
      ultimoOperador: ultimoOperador
    });
  }

  return resultado;
}

/**
 * Obtém dados da equipe com contagem semanal
 */
function obterDadosEquipe(configData, registrosData) {
  var resultado = [];
  var tz = Session.getScriptTimeZone();

  // Calcular início da semana (segunda-feira 00:00)
  var agora = new Date();
  var inicioSemana = new Date(agora);
  var diaSemana = inicioSemana.getDay(); // 0=dom, 1=seg, ...
  var diasParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
  inicioSemana.setDate(inicioSemana.getDate() - diasParaSegunda);
  inicioSemana.setHours(0, 0, 0, 0);

  // Ler funcionários da aba Configurações (a partir da linha 7, índice 6)
  for (var i = 6; i < configData.length; i++) {
    if (!configData[i][0] || configData[i][0] === '') break;

    var codigoFunc = configData[i][0];
    var nomeFunc = configData[i][1];
    var trocasSemana = 0;
    var trocasTotal = 0;
    var ultimaAtividade = '';

    for (var j = registrosData.length - 1; j >= 1; j--) {
      if (registrosData[j][2] === codigoFunc) {
        trocasTotal++;

        var dataRegistro = new Date(registrosData[j][1]);
        if (dataRegistro >= inicioSemana) {
          trocasSemana++;
        }

        if (ultimaAtividade === '') {
          try {
            ultimaAtividade = Utilities.formatDate(dataRegistro, tz, 'dd/MM HH:mm');
          } catch (e) {
            ultimaAtividade = String(registrosData[j][1]);
          }
        }
      }
    }

    resultado.push({
      codigo: codigoFunc,
      nome: nomeFunc,
      trocasSemana: trocasSemana,
      trocasTotal: trocasTotal,
      ultimaAtividade: ultimaAtividade
    });
  }

  return resultado;
}

/**
 * Obtém os últimos 10 registros de atividade
 */
function obterAtividadeRecente(registrosData) {
  var resultado = [];
  var tz = Session.getScriptTimeZone();

  var inicio = Math.max(1, registrosData.length - 10);

  for (var i = registrosData.length - 1; i >= inicio; i--) {
    var dataFormatada = '';
    try {
      dataFormatada = Utilities.formatDate(new Date(registrosData[i][1]), tz, 'dd/MM HH:mm');
    } catch (e) {
      dataFormatada = String(registrosData[i][1]);
    }

    resultado.push({
      dataHora: dataFormatada,
      funcionario: registrosData[i][2],
      empilhadeira: registrosData[i][3],
      bateriaInstalada: registrosData[i][4],
      bateriaRemovida: registrosData[i][5],
      nivelAgua: registrosData[i][6],
      duracao: registrosData[i][7] ? parseFloat(registrosData[i][7]).toFixed(2) : 'N/A',
      horimetro: registrosData[i][8] !== undefined && registrosData[i][8] !== '' ? registrosData[i][8] : 'N/A'
    });
  }

  return resultado;
}

/**
 * Atualiza os tempos decorridos na aba Baterias
 */
function atualizarTemposDecorridos() {
  var abas = getAbas();
  var bateriasData = abas.baterias.getDataRange().getValues();
  var agora = new Date();
  
  for (var i = 1; i < bateriasData.length; i++) {
    var tempoDecorrido = calcularDuracao(bateriasData[i][3], agora);
    abas.baterias.getRange(i + 1, 5).setValue(tempoDecorrido.toFixed(2));
  }
}

/**
 * Obtém histórico de uma bateria específica
 */
function obterHistoricoBateria(codigoBateria) {
  try {
    var abas = getAbas();
    var registrosData = abas.registros.getDataRange().getValues();
    var historico = [];
    
    for (var i = 1; i < registrosData.length; i++) {
      if (registrosData[i][4] === codigoBateria || registrosData[i][5] === codigoBateria) {
        historico.push({
          dataHora: Utilities.formatDate(registrosData[i][1], Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'),
          funcionario: registrosData[i][2],
          empilhadeira: registrosData[i][3],
          bateriaInstalada: registrosData[i][4],
          bateriaRemovida: registrosData[i][5],
          nivelAgua: registrosData[i][6],
          duracaoUso: registrosData[i][7] ? registrosData[i][7].toFixed(2) : 'N/A',
          horimetro: registrosData[i][8] !== undefined && registrosData[i][8] !== '' ? registrosData[i][8] : 'N/A'
        });
      }
    }
    
    return {
      sucesso: true,
      historico: historico.reverse() // Mais recente primeiro
    };
    
  } catch (error) {
    return {
      sucesso: false,
      erro: error.toString()
    };
  }
}

// ==================== MÓDULO: RELATÓRIOS ====================

/**
 * Gera relatório de desempenho das baterias
 */
function gerarRelatorioDesempenho() {
  try {
    var abas = getAbas();
    var bateriasData = abas.baterias.getDataRange().getValues();
    var relatorio = [];
    
    for (var i = 1; i < bateriasData.length; i++) {
      relatorio.push({
        bateria: bateriasData[i][0],
        totalUsos: bateriasData[i][6],
        mediaDuracao: bateriasData[i][7] ? bateriasData[i][7].toFixed(2) : '0.00',
        statusAtual: bateriasData[i][1],
        ultimoNivelAgua: bateriasData[i][5]
      });
    }
    
    // Ordenar por média de duração (maior para menor)
    relatorio.sort(function(a, b) {
      return parseFloat(b.mediaDuracao) - parseFloat(a.mediaDuracao);
    });
    
    return {
      sucesso: true,
      relatorio: relatorio
    };
    
  } catch (error) {
    return {
      sucesso: false,
      erro: error.toString()
    };
  }
}
