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
- Leitura de QR Codes em 4 passos:
  1. Funcionário (ex: PL01)
  2. Empilhadeira (ex: N01)
  3. Bateria nova (ex: BAT05)
  4. Nível de água (OK/Atenção/Crítico)
- Validação em tempo real
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
Código Empilhadeira    Bateria Atual    Última Troca
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
2. **Siga os 4 passos:**
   - 📱 Escaneie seu QR code
   - 🚜 Escaneie o QR da empilhadeira
   - 🔋 Escaneie o QR da bateria nova
   - 💧 Selecione o nível de água
3. **Confirme** o registro
4. Pronto! A troca foi registrada

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
/* Cor principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

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
| Duração Uso Anterior | Horas que a anterior trabalhou | 8.5 |

### Aba: Baterias
Estado ATUAL de cada bateria.

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| Código Bateria | ID da bateria | BAT01 |
| Status | Em Uso / Em Carga | Em Carga |
| Localização | Onde está | Carregador / N01 |
| Início Status | Quando entrou neste status | 04/02/2026 14:30 |
| Tempo Decorrido | Horas neste status | 5.2 |
| Último Nível Água | Última verificação | OK |
| Total de Usos | Quantas vezes foi usada | 45 |
| Média Duração | Tempo médio de trabalho | 7.8 |

### Aba: Configurações
Parâmetros do sistema e cadastro de funcionários.

### Aba: Equipamentos
Estado atual de cada empilhadeira.

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
**Versão:** 1.0

---

## 🔗 Links Úteis

- [Google Sheets](https://sheets.google.com)
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Documentação HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)

---

**💡 Dica:** Mantenha este README sempre atualizado quando fizer modificações no sistema!
