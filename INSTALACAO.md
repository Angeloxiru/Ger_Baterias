# 🚀 Guia Rápido de Instalação

## ⏱️ Tempo estimado: 10-15 minutos

---

## 📋 Checklist Pré-Instalação

Antes de começar, certifique-se de ter:
- [ ] Conta Google ativa
- [ ] Acesso ao Google Sheets
- [ ] Todos os arquivos do projeto baixados
- [ ] Códigos QR já impressos (funcionários, empilhadeiras, baterias)

---

## 🎯 Instalação Rápida

### 1️⃣ Criar Planilha (2 min)

1. Acesse: https://sheets.google.com
2. Clique em **+ Criar** > **Planilha em branco**
3. Nomeie: "Controle de Baterias"

---

### 2️⃣ Abrir Editor (1 min)

1. Na planilha: **Extensões** > **Apps Script**
2. Apague o código que aparece

---

### 3️⃣ Adicionar Código Backend (3 min)

1. Cole todo o conteúdo de `Code.gs`
2. Salve: **Ctrl+S** ou ícone 💾

---

### 4️⃣ Adicionar Arquivos HTML (4 min)

**Para cada arquivo abaixo:**
1. Clique no **+** ao lado de "Arquivos"
2. Selecione **HTML**
3. Nomeie EXATAMENTE como indicado
4. Cole o conteúdo
5. Salve

Arquivos a criar:
- ✅ `index.html`
- ✅ `styles.html`
- ✅ `script.html`
- ✅ `painel.html`

---

### 5️⃣ Inicializar Sistema (2 min)

1. No editor, localize o menu dropdown (topo)
2. Selecione: `inicializarPlanilha`
3. Clique em **Executar** ▶️
4. **Primeira vez:** Autorize o aplicativo
   - Clique em "Analisar permissões"
   - Escolha sua conta
   - Clique em "Avançado"
   - Clique em "Acessar [nome do projeto] (não seguro)"
   - Clique em "Permitir"
5. Aguarde o ✅ verde aparecer

**Resultado:** 4 abas criadas na planilha!

---

### 6️⃣ Publicar Web App (3 min)

1. Clique em **Implantar** > **Nova implantação**
2. Clique no ícone ⚙️
3. Selecione: **Aplicativo da Web**
4. Configure:
   ```
   Descrição: Sistema de Controle de Baterias
   Executar como: Eu (seu@email.com)
   Quem tem acesso: Qualquer pessoa
   ```
5. Clique em **Implantar**
6. **COPIE A URL** que aparece!

Exemplo de URL:
```
https://script.google.com/macros/s/ABC...XYZ/exec
```

---

## ✅ Verificação Rápida

### Teste 1: Planilha
Abra sua planilha e verifique se tem estas abas:
- ✅ Registros
- ✅ Baterias (com BAT01 a BAT12)
- ✅ Configurações (com PL01 a PL05)
- ✅ Equipamentos (com N01 a N05)

### Teste 2: Interface de Registro
1. Abra a URL copiada no navegador
2. Deve aparecer: "🔋 Troca de Bateria"
3. Digite "PL01" no campo funcionário
4. Clique em "Próximo"

Se funcionar = **SUCESSO!** ✅

### Teste 3: Painel
1. Adicione `?page=painel` no final da URL
2. Exemplo: `sua-url/exec?page=painel`
3. Deve aparecer o painel com estatísticas

---

## 🎨 Configuração Inicial

### Passo 1: Cadastrar Funcionários
Na planilha, aba **Configurações**:

```
Código    Nome
PL01      [Nome Real]
PL02      [Nome Real]
PL03      [Nome Real]
...
```

### Passo 2: Confirmar Empilhadeiras
Na aba **Equipamentos**, ajuste se necessário:

```
N01
N02
N03
N04
N05
```

### Passo 3: Confirmar Baterias
Na aba **Baterias**, verifique:

```
BAT01 a BAT12 devem estar listadas
```

---

## 📱 Distribuir para Equipe

### Criar QR Code do Link

1. Acesse: https://www.qr-code-generator.com
2. Cole a URL da sua aplicação
3. Gere o QR Code
4. Imprima e cole na área de trabalho

### Adicionar aos Coletores

**Opção 1 - Atalho na Tela Inicial:**
1. Abra o link no navegador do coletor
2. Menu (⋮) > "Adicionar à tela inicial"
3. Pronto! Ícone criado

**Opção 2 - Favorito:**
1. Abra o link
2. Menu (⋮) > "Adicionar aos favoritos"

---

## ⚠️ Problemas Comuns

### "Código não reconhecido"
❌ **Problema:** Funcionário PL01 não funciona
✅ **Solução:** Verifique se está cadastrado na aba Configurações

### "Erro de permissão"
❌ **Problema:** Script não executa
✅ **Solução:** Refaça autorização no passo 5

### "Página não carrega"
❌ **Problema:** URL não abre
✅ **Solução:** 
1. Verifique se copiou a URL completa
2. Teste em navegador anônimo
3. Reimplante o webapp

---

## 🎓 Próximos Passos

Após instalação bem-sucedida:

1. ✅ Treine a equipe no uso
2. ✅ Faça testes com todas as baterias
3. ✅ Configure alertas (se necessário)
4. ✅ Estabeleça rotina de backup
5. ✅ Leia o README completo

---

## 📞 Precisa de Ajuda?

Consulte o **README.md** principal para:
- Documentação completa
- Troubleshooting detalhado
- Guias de personalização
- FAQ

---

## 🎉 Pronto!

Seu sistema está funcionando! 

**Links importantes:**
- 📱 Interface de Registro: `[sua-url]`
- 📊 Painel: `[sua-url]?page=painel`
- 📄 Planilha: Link da sua planilha Google

Bom trabalho! 🚀
