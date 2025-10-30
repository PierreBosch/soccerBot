# 🚀 Deploy no EasyPanel - Guia Completo

## ⚠️ Importante: Configuração Necessária

**NÃO**, apenas subir o projeto no EasyPanel **NÃO é suficiente**. Você precisa configurar:
- ✅ Variáveis de ambiente
- ✅ Volumes persistentes
- ✅ Portas corretas
- ✅ Build settings

Este guia te mostra **exatamente** como fazer isso.

---

## 📋 Pré-requisitos

Antes de começar, tenha em mãos:
- [ ] Conta no EasyPanel
- [ ] Repositório GitHub: `https://github.com/PierreBosch/soccerBot`
- [ ] Chave da API OpenAI (começa com `sk-proj-...`)

---

## 🎯 Passo a Passo no EasyPanel

### **Passo 1: Criar Novo Projeto**

1. Acesse o EasyPanel
2. Clique em **"Create Project"**
3. Escolha **"From Git Repository"**
4. Cole a URL: `https://github.com/PierreBosch/soccerBot`
5. Branch: `main`
6. Clique em **"Continue"**

---

### **Passo 2: Configurar Build Settings**

Na seção **Build Configuration**:

```yaml
Build Method: Dockerfile
Dockerfile Path: ./Dockerfile
Context Path: .
```

**✅ O EasyPanel vai usar o Dockerfile do projeto automaticamente!**

---

### **Passo 3: Configurar Variáveis de Ambiente** 🔑

Na seção **Environment Variables**, adicione:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `OPENAI_API_KEY` | `sk-proj-sua-chave-aqui` | Chave da API OpenAI |
| `NODE_ENV` | `production` | Ambiente de produção |

**⚠️ IMPORTANTE:** Substitua `sk-proj-sua-chave-aqui` pela sua chave real!

---

### **Passo 4: Configurar Portas**

Na seção **Ports**:

| Container Port | Protocol | Expose Publicly |
|----------------|----------|-----------------|
| `3000` | HTTP | ✅ Sim |
| `3001` | HTTP | ✅ Sim |

**Nota:** A porta 3001 é para o JSON Server (banco de dados).

---

### **Passo 5: Configurar Volumes Persistentes** 💾

**CRÍTICO:** Sem volumes, você perde os dados a cada deploy!

Na seção **Volumes**, adicione:

| Mount Path | Volume Name | Description |
|------------|-------------|-------------|
| `/usr/src/app/tokens` | `soccerbot-tokens` | Sessão WhatsApp |
| `/usr/src/app/db.json` | `soccerbot-db` | Banco de dados |
| `/usr/src/app/out.png` | `soccerbot-qr` | QR Code |

**Como adicionar:**
1. Clique em **"Add Volume"**
2. Type: **"Named Volume"** (não "Bind Mount")
3. Mount Path: `/usr/src/app/tokens`
4. Volume Name: `soccerbot-tokens`
5. Repita para `db.json` e `out.png`

---

### **Passo 6: Configurar Restart Policy**

Na seção **Advanced Settings**:

```yaml
Restart Policy: unless-stopped
```

Isso garante que o bot reinicia automaticamente se cair.

---

### **Passo 7: Deploy!**

1. Revise todas as configurações
2. Clique em **"Deploy"**
3. Aguarde o build (pode levar 3-5 minutos)
4. Veja os logs em tempo real

---

## 📱 Primeiro Login no WhatsApp

Após o deploy bem-sucedido:

### **Método 1: Ver QR Code nos Logs**

1. No EasyPanel, vá em **"Logs"**
2. Procure pelo QR Code ASCII no console
3. Escaneie com o WhatsApp
4. Aguarde a mensagem "Conectado!"

### **Método 2: Baixar Imagem do QR Code**

1. Acesse o shell do container
2. Execute: `cat out.png | base64`
3. Copie o base64 e converta para imagem
4. Escaneie com o WhatsApp

---

## 🔄 Como Fazer Redeploy (Atualizar)

Quando você fizer alterações no código:

### **Opção 1: Redeploy Automático (GitHub)**

1. Faça push para o repositório
2. No EasyPanel, vá em **"Settings"**
3. Ative **"Auto Deploy on Push"**
4. Pronto! Deploy automático a cada commit

### **Opção 2: Redeploy Manual**

1. No EasyPanel, clique em **"Redeploy"**
2. Aguarde o rebuild
3. ✅ **Seus dados são mantidos** (graças aos volumes!)

---

## 🔍 Verificar se Está Funcionando

### **1. Verificar Logs**

No EasyPanel, vá em **"Logs"** e procure por:

```
✅ "WhatsApp conectado!"
✅ "PM2 started"
✅ "Server running on port 3000"
✅ "JSON Server running on port 3001"
```

### **2. Testar no WhatsApp**

1. Adicione o bot em um grupo
2. Envie: `/lista`
3. O bot deve responder!

### **3. Verificar Volumes**

No shell do container:
```bash
ls -la /usr/src/app/tokens    # Deve ter arquivos
ls -la /usr/src/app/db.json   # Deve existir
```

---

## 🛠️ Troubleshooting

### **Problema: "QR Code não aparece nos logs"**

**Solução:**
```bash
# Acesse o shell do container
cd /usr/src/app
cat out.png  # Deve mostrar conteúdo
```

Se não existir, reinicie o container.

---

### **Problema: "OpenAI não funciona"**

**Causa:** Chave da API não configurada ou inválida

**Solução:**
1. Vá em **"Environment Variables"**
2. Verifique se `OPENAI_API_KEY` está correta
3. Teste a chave em: https://platform.openai.com/api-keys
4. Redeploy após corrigir

---

### **Problema: "Banco de dados resetado após redeploy"**

**Causa:** Volumes não configurados corretamente

**Solução:**
1. Vá em **"Volumes"**
2. Certifique-se que os volumes estão como **"Named Volume"**
3. Verifique os mount paths:
   - `/usr/src/app/tokens`
   - `/usr/src/app/db.json`
   - `/usr/src/app/out.png`
4. Redeploy

---

### **Problema: "Container não inicia"**

**Solução:**
1. Verifique os logs para erros
2. Erros comuns:
   - Porta já em uso → Mude as portas
   - Falta de memória → Aumente recursos
   - Dockerfile com erro → Verifique sintaxe

---

### **Problema: "Preciso fazer login novamente após redeploy"**

**Causa:** Volume `tokens/` não está persistindo

**Solução:**
1. Certifique-se que o volume está configurado:
   - Mount Path: `/usr/src/app/tokens`
   - Type: Named Volume
2. Não use "Bind Mount" no EasyPanel
3. Redeploy e faça login novamente

---

## 📊 Monitoramento

### **Recursos Recomendados**

Para o SoccerBot funcionar bem:

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| CPU | 0.5 core | 1 core |
| RAM | 512 MB | 1 GB |
| Disco | 1 GB | 2 GB |

### **Logs em Tempo Real**

```bash
# No shell do container
pm2 logs

# Ver processos
pm2 list

# Ver uso de memória
pm2 show futebot-start
```

---

## 🔐 Segurança

### **Variáveis de Ambiente**

✅ **BOM:** Usar o sistema de Environment Variables do EasyPanel
❌ **RUIM:** Commitar `.env` no repositório

### **Volumes**

✅ **BOM:** Named Volumes (gerenciados pelo EasyPanel)
❌ **RUIM:** Bind Mounts (podem expor dados)

### **Portas**

- Porta 3000: Pode ser pública (API do bot)
- Porta 3001: Pode ser pública (JSON Server) ou privada

---

## 📝 Checklist de Deploy

Antes de fazer deploy, confirme:

- [ ] Repositório GitHub configurado
- [ ] Variável `OPENAI_API_KEY` adicionada
- [ ] Portas 3000 e 3001 configuradas
- [ ] Volumes persistentes criados:
  - [ ] `/usr/src/app/tokens`
  - [ ] `/usr/src/app/db.json`
  - [ ] `/usr/src/app/out.png`
- [ ] Restart policy: `unless-stopped`
- [ ] Build method: Dockerfile

---

## 🎯 Resumo Visual

```
GitHub Repo
    ↓
EasyPanel Build (Dockerfile)
    ↓
Container Running
    ↓
Volumes Montados:
├── tokens/     → Sessão WhatsApp
├── db.json     → Banco de dados
└── out.png     → QR Code
    ↓
Bot Funcionando! 🎉
```

---

## 🆘 Suporte

Se tiver problemas:

1. **Verifique os logs** no EasyPanel
2. **Teste localmente** com Docker Compose
3. **Verifique variáveis** de ambiente
4. **Confirme volumes** estão montados
5. **Reinicie** o container

---

## 🚀 Comandos Úteis no Shell

Acesse o shell do container no EasyPanel:

```bash
# Ver processos
pm2 list

# Ver logs
pm2 logs

# Reiniciar processo
pm2 restart all

# Ver arquivos
ls -la /usr/src/app/

# Verificar tokens
ls -la /usr/src/app/tokens/

# Ver banco de dados
cat /usr/src/app/db.json

# Verificar variáveis
env | grep OPENAI
```

---

## ✅ Pronto!

Seguindo este guia, seu SoccerBot estará rodando no EasyPanel com:
- ✅ Dados persistentes
- ✅ Deploy automático
- ✅ Logs em tempo real
- ✅ Restart automático
- ✅ Fácil de atualizar

**Qualquer dúvida, consulte os logs!** 📋

