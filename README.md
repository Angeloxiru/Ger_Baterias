# 🔋 Sistema de Controle de Baterias de Empilhadeiras

Sistema completo para gerenciamento e monitoramento de baterias de empilhadeiras, com interface web otimizada para coletores Android.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Personalização](#personalização)
- [Manutenção](#manutenção)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este sistema foi desenvolvido para controlar:
- ✅ Registro de trocas de baterias
- ✅ Monitoramento de tempo de carga (9.5 horas)
- ✅ Verificação de nível de água (OK/Atenção/Crítico)
- ✅ Histórico de uso por bateria
- ✅ Estatísticas e relatórios de desempenho
- ✅ Interface 100% web responsiva para Android

### Tecnologias Utilizadas
- **Google Sheets** - Banco de dados
- **Google Apps Script** - Backend/API
- **HTML/CSS/JavaScript** - Frontend

---

## ⚙️ Funcionalidades

### 📱 Interface de Registro (Coletores)
- Registro de troca em 5 passos:
  1. Funcionário (ex: PL01)
  2. Empilhadeira (ex: N01)
  3. Horimetro da empilhadeira (leitura do painel da máquina)
  4. Bateria nova (ex: BAT05)
  5. Nível de água (OK/Atenção/Crítico)
- Validação em tempo real
- Duração das baterias calculada por horimetro (horas de máquina reais)
- Interface intuitiva adaptada para touch

### 📊 Painel de Controle
- Estatísticas em tempo real
- Visualização de baterias em carga/uso
- Barras de progresso com cores:
  - 🔴 Vermelho: 0-7h de carga
  - 🟡 Amarelo: 7-9.5h de carga
  - 🟢 Verde: 9.5h+ (carga completa)
- Histórico detalhado por bateria
- Relatório de desempenho
- Atualização automática a cada 30 segundos

---

## 📁 Estrutura do Projeto

```
battery-management/
│
├── Code.gs                 # Backend principal (Google Apps Script)
├── index.html             # Interface de registro
├── styles.html            # Estilos CSS da interface
├── script.html            # JavaScript da interface
├── painel.html            # Painel de controle
├── Banco.gs               # Envio das trocas ao banco do app Tarefas (Turso)
└── README.md              # Esta documentação
```

---

## 🚀 Instalação

### Passo 1: Criar o Google Sheet

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Nomeie como "Controle de Baterias"

### Passo 2: Abrir o Editor de Scripts

1. Na planilha, clique em **Extensões** > **Apps Script**
2. Apague o código padrão que aparece

### Passo 3: Adicionar os Arquivos

#### 3.1. Adicionar Code.gs
1. Cole todo o conteúdo do arquivo `Code.gs`
2. Salve (Ctrl+S)

#### 3.2. Adicionar arquivos HTML
1. Clique no **+** ao lado de "Arquivos"
2. Selecione **HTML**
3. Crie os seguintes arquivos (um por um):
   - `index.html` (cole o conteúdo)
   - `styles.html` (cole o conteúdo)
   - `script.html` (cole o conteúdo)
   - `painel.html` (cole o conteúdo)

### Passo 4: Inicializar a Planilha

1. No editor de scripts, encontre a função `inicializarPlanilha`
2. Selecione-a no menu dropdown do topo
3. Clique em **Executar** (▶️)
4. Autorize o script quando solicitado
5. Aguarde a execução (check verde ✓)

**Resultado:** 4 abas serão criadas na planilha:
- ✅ Registros
- ✅ Baterias
- ✅ Configurações
- ✅ Equipamentos

### Passo 5: Implantar como Web App

1. Clique em **Implantar** > **Nova implantação**
2. Clique na engrenagem ⚙️ e selecione **Aplicativo da Web**
3. Configure:
   - **Descrição:** Sistema de Controle de Baterias
   - **Executar como:** Eu (seu email)
   - **Quem tem acesso:** Qualquer pessoa
4. Clique em **Implantar**
5. **IMPORTANTE:** Copie a URL gerada (você vai precisar!)

---

## 🔗 Integração com o app Tarefas (banco Turso)

Desde novembro/2026 cada troca registrada aqui também vai para o banco do app **Ger_Tarefas**,
onde soma **15 minutos** ao tempo trabalhado do funcionário (bonificação N1) e aparece no
Histórico e no Raio X do gestor. **O registro pelo QR code não muda.**

Como funciona (`Banco.gs`):
- Depois de gravar a troca na aba **Registros**, o script envia uma cópia ao banco.
- Se o envio falhar (internet, banco fora do ar), a troca **continua registrada na planilha** e o
  funcionário não percebe nada.
- A coluna **J "Enviado ao banco"** da aba Registros mostra quando cada troca foi enviada. Vazia = pendente.
- A rotina `sincronizarBanco()` roda a cada **15 minutos**: envia as trocas pendentes e copia as
  abas Equipamentos e Baterias. Na primeira execução envia **todo o histórico**.
- Enviar a mesma troca de novo não duplica (chave = data/hora + empilhadeira).
- Os códigos de funcionário são os mesmos crachás do app Tarefas (ex.: PL33).

### Configurar (uma vez)
1. No editor do Apps Script, crie o arquivo **Banco.gs** (Arquivo > + > Script) e cole o conteúdo
   deste repositório. Atualize também o **Code.gs**.
2. **Configurações do projeto** (engrenagem) > **Propriedades do script** > adicionar:
   - `TURSO_URL` = `libsql://tarefas-angeloxiru.aws-us-east-1.turso.io`
   - `TURSO_TOKEN` = o token do banco (o mesmo `TURSO_TOKEN` do `js/config.js` do Ger_Tarefas)
3. Selecione a função **`testarConexaoBanco`** e clique em Executar. Autorize o acesso a
   "serviço externo" quando pedido. O registro de execução deve mostrar "Conexão com o banco OK.".
4. Selecione **`configurarSincronizacao`** e Execute. Ela cria a coluna J, o gatilho de 15 min e
   já envia todo o histórico (pode levar alguns minutos; se não terminar, a próxima execução continua).
5. **Implantar > Gerenciar implantações > Editar > Nova versão**, na **mesma** implantação (a URL do
   QR code não muda).

## ⚙️ Configuração

### Configurar Funcionários

1. Abra a planilha
2. Vá para a aba **Configurações**
3. Edite a seção "FUNCIONÁRIOS CADASTRADOS":

```
Código    Nome
PL01      João Silva
PL02      Maria Santos
PL03      Pedro Oliveira
...
```

### Configurar Empilhadeiras

1. Vá para a aba **Equipamentos**
2. Edite os códigos das empilhadeiras:

```
Código Empilhadeira    Bateria Atual    Última Troca    Último Horimetro
N01
N02
N03
...
```

### Configurar Baterias

1. Vá para a aba **Baterias**
2. Adicione ou remova baterias conforme necessário:

```
Código Bateria    Status        Localização    ...
BAT01             Em Carga      Carregador     ...
BAT02             Em Carga      Carregador     ...
...
```

### Ajustar Parâmetros

Na aba **Configurações**, você pode alterar:

```
PARÂMETRO                          VALOR
Tempo Carga Completa (horas)       9.5
Tempo Alerta Amarelo (horas)       7
```

---

## 📱 Como Usar

### Para Funcionários (Coletores Android)

1. **Acesse o link da aplicação** no navegador do coletor
2. **Siga os 5 passos:**
   - 📱 Escaneie seu QR code (funcionário)
   - 🚜 Escaneie o QR da empilhadeira
   - 🔢 Informe a leitura do **horimetro** da empilhadeira (painel da máquina)
   - 🔋 Escaneie o QR da bateria nova
   - 💧 Selecione o nível de água
3. **Confirme** o registro no resumo
4. Pronto! A troca foi registrada com a duração calculada pelo horimetro

### Para Supervisores (Painel)

1. **Acesse:** `[SUA_URL]?page=painel`
2. Visualize:
   - Estatísticas gerais
   - Baterias em carregamento
   - Baterias em uso
3. **Clique em uma bateria** para ver histórico completo
4. **Clique em "Relatório"** para análise de desempenho

---

## 🎨 Personalização

### Alterar Cores

Edite o arquivo `styles.html` e altere as variáveis de cor:

```css
/* Cor principal (body) */
background-color: #667eea;

/* Cores dos níveis de água */
.nivel-ok { border-color: #00C851; }
.nivel-atencao { border-color: #ffbb33; }
.nivel-critico { border-color: #ff4444; }
```

### Adicionar Novos Campos

#### No Registro:
1. Edite `index.html` - adicione novo passo
2. Edite `script.html` - adicione validação
3. Edite `Code.gs` função `registrarTroca` - salve novo campo

#### Na Planilha:
1. Adicione coluna na aba desejada
2. Atualize função correspondente no `Code.gs`

### Alterar Tempo de Carga

Na aba **Configurações** da planilha, altere:
```
Tempo Carga Completa (horas)    9.5  ← Altere aqui
```

---

## 🔧 Manutenção

### Backup Regular

**Recomendado:** Backup semanal
1. Abra a planilha
2. Arquivo > Fazer download > Microsoft Excel (.xlsx)
3. Salve em local seguro

### Limpar Dados Antigos

Se a planilha ficar muito grande:

1. Vá para aba **Registros**
2. Selecione registros antigos (ex: mais de 1 ano)
3. Clique com botão direito > Excluir linhas
4. **IMPORTANTE:** Faça backup antes!

### Adicionar Novas Baterias

1. Aba **Baterias**
2. Adicione nova linha:
```
BAT13    Em Carga    Carregador    [data atual]    0    OK    0    0
```
(9 colunas — a última, Horimetro Instalação, fica vazia enquanto a bateria estiver em carga)

### Adicionar Novos Funcionários

1. Aba **Configurações**
2. Adicione na seção de funcionários:
```
PL06    Nome do Novo Funcionário
```

### Atualizar URLs (após nova implantação)

Quando fizer nova implantação:
1. Copie a nova URL
2. Atualize os links salvos nos coletores
3. Notifique a equipe

---

## 🐛 Troubleshooting

### Problema: trocas não aparecem no app Tarefas
1. Veja a coluna J da aba Registros: vazia = ainda não enviada.
2. Execute `testarConexaoBanco` e leia o registro de execução.
3. Confira as Propriedades do script (`TURSO_URL`, `TURSO_TOKEN`) e se o gatilho `sincronizarBanco`
   existe em Acionadores (relógio). Se não existir, execute `configurarSincronizacao` de novo.

### Problema: "Funcionário não cadastrado"

**Solução:**
1. Verifique se o código está na aba **Configurações**
2. Certifique-se que está escrito EXATAMENTE igual
3. Código diferencia maiúsculas/minúsculas

### Problema: "Erro ao registrar troca"

**Possíveis causas:**
1. Permissões do script expiraram
   - Reimplante o webapp
2. Planilha foi movida/renomeada
   - Verifique o ID da planilha
3. Internet instável
   - Tente novamente

### Problema: Painel não atualiza

**Solução:**
1. Pressione F5 para recarregar
2. Limpe cache do navegador
3. Verifique conexão com internet

### Problema: QR Code não é reconhecido

**Solução:**
1. Verifique se o código está cadastrado
2. Limpe a câmera do coletor
3. Melhore a iluminação
4. Digite o código manualmente se necessário

### Problema: Bateria aparece "Em Uso" mas deveria estar disponível

**Solução:**
1. Verifique aba **Baterias**
2. Corrija manualmente o status se necessário
3. Isso pode ocorrer se houver erro no último registro

### Problema: Duração da bateria aparece como 0 horas

**Possíveis causas:**
1. A bateria foi instalada antes da versão 1.1 (sem horimetro registrado na instalação)
   - Registros anteriores não têm horimetro de referência, então a duração não pode ser calculada
   - Após a próxima troca com horimetro, os cálculos voltam ao normal
2. O horimetro informado na troca atual é menor que o da instalação anterior
   - Verifique se a leitura do horimetro foi digitada corretamente

### Problema: Horimetro parece errado no painel

**Solução:**
1. O horimetro mostrado no painel ("Instalado no horimetro: Xh") é a leitura que foi informada na última troca
2. Verifique a aba **Registros** para confirmar o valor registrado
3. Se foi digitado errado, edite diretamente na planilha na coluna **Horimetro Instalação** da aba **Baterias**

---

## 📊 Estrutura de Dados

### Aba: Registros
Armazena TODOS os registros de trocas realizadas.

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| ID | Identificador único | 1, 2, 3... |
| Data/Hora | Timestamp da troca | 04/02/2026 14:30 |
| Funcionário | Quem fez a troca | PL01 |
| Empilhadeira | Onde foi feita | N01 |
| Bateria Instalada | Bateria que entrou | BAT05 |
| Bateria Removida | Bateria que saiu | BAT03 |
| Nível Água | Status verificado | OK/Atenção/Crítico |
| Duração Uso Anterior | Horas de máquina da anterior (por horimetro) | 8.5 |
| Horimetro | Leitura do horimetro na troca | 1247 |

### Aba: Baterias
Estado ATUAL de cada bateria.

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| Código Bateria | ID da bateria | BAT01 |
| Status | Em Uso / Em Carga | Em Carga |
| Localização | Onde está | Carregador / N01 |
| Início Status | Quando entrou neste status | 04/02/2026 14:30 |
| Tempo Decorrido | Horas de carga neste status (por relógio) | 5.2 |
| Último Nível Água | Última verificação | OK |
| Total de Usos | Quantas vezes foi usada | 45 |
| Média Duração | Média de horas de máquina por uso (por horimetro) | 7.8 |
| Horimetro Instalação | Horimetro da empilhadeira quando a bateria foi instalada | 1247 |

### Aba: Configurações
Parâmetros do sistema e cadastro de funcionários.

### Aba: Equipamentos
Estado atual de cada empilhadeira.

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| Código Empilhadeira | ID da empilhadeira | N01 |
| Bateria Atual | Bateria instalada atualmente | BAT05 |
| Última Troca | Timestamp da última troca | 04/02/2026 14:30 |
| Último Horimetro | Última leitura do horimetro registrada | 1247 |

---

## 📈 Melhorias Futuras Sugeridas

Possíveis expansões do sistema:

- [ ] Notificações por email quando bateria estiver pronta
- [ ] Alertas de manutenção preventiva
- [ ] Integração com sistema de RH
- [ ] Gráficos de tendência de desempenho
- [ ] Exportação automática de relatórios
- [ ] App mobile nativo
- [ ] Leitura automática de QR Code (sem botão)
- [ ] Sistema de reserva de baterias

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte este README
2. Verifique a seção [Troubleshooting](#troubleshooting)
3. Revise as configurações da planilha
4. Entre em contato com o desenvolvedor/TI

---

## 📝 Changelog

### Versão 1.1 (Fevereiro 2026)
- ✅ Registro do horimetro da empilhadeira no fluxo de troca
- ✅ Duração das baterias calculada por horimetro (horas de máquina reais)
- ✅ Média de duração no painel e relatório agora reflete horas de máquina
- ✅ Histórico de baterias exibe horimetro e duração em h máq
- ✅ Painel exibe horimetro de instalação nas baterias Em Uso
- ✅ Otimizações de desempenho visual para Zebra MC2200 (800x480)

### Versão 1.0 (Fevereiro 2026)
- ✅ Sistema completo de registro de trocas
- ✅ Painel de monitoramento em tempo real
- ✅ Validação de QR Codes
- ✅ Histórico completo por bateria
- ✅ Relatórios de desempenho
- ✅ Interface responsiva para Android

---

## 📄 Licença

Sistema desenvolvido para uso interno da empresa.
Todos os direitos reservados.

---

## 🙏 Créditos

Desenvolvido com ❤️ para otimizar o controle de baterias e aumentar a eficiência operacional.

**Última atualização:** Fevereiro 2026
**Versão:** 1.1

---

## 🔗 Links Úteis

- [Google Sheets](https://sheets.google.com)
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Documentação HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)

---

**💡 Dica:** Mantenha este README sempre atualizado quando fizer modificações no sistema!
