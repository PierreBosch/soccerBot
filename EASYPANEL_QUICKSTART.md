# ⚡ EasyPanel - Quick Start (5 minutos)

## 🎯 Resposta Rápida

**NÃO**, apenas subir o projeto **NÃO funciona**. Você precisa configurar 3 coisas:

1. ✅ **Variável de ambiente** (chave OpenAI)
2. ✅ **Volumes persistentes** (para não perder dados)
3. ✅ **Portas** (3000 e 3001)

---

## 🚀 Deploy em 5 Passos

### **1️⃣ Criar Projeto no EasyPanel**

```
1. Clique em "Create Project"
2. Escolha "From Git Repository"
3. Cole: https://github.com/PierreBosch/soccerBot
4. Branch: main
```

---

### **2️⃣ Adicionar Variável de Ambiente** 🔑

Na seção **Environment Variables**:

```
OPENAI_API_KEY = sk-proj-sua-chave-aqui
```

⚠️ **OBRIGATÓRIO!** Sem isso o bot não funciona.

---

### **3️⃣ Configurar Volumes** 💾

Na seção **Volumes**, adicione 3 volumes:

| Mount Path | Volume Name |
|------------|-------------|
| `/usr/src/app/tokens` | `soccerbot-tokens` |
| `/usr/src/app/db.json` | `soccerbot-db` |
| `/usr/src/app/out.png` | `soccerbot-qr` |

**Tipo:** Named Volume (não Bind Mount)

⚠️ **IMPORTANTE!** Sem volumes, você perde tudo a cada deploy!

---

### **4️⃣ Configurar Portas**

Na seção **Ports**:

```
3000 → HTTP → Público
3001 → HTTP → Público
```

---

### **5️⃣ Deploy!**

```
1. Clique em "Deploy"
2. Aguarde 3-5 minutos
3. Veja os logs
4. Procure pelo QR Code
5. Escaneie com WhatsApp
6. Pronto! 🎉
```

---

## 📱 Como Fazer Login no WhatsApp

Após o deploy:

1. Vá em **"Logs"** no EasyPanel
2. Procure pelo QR Code ASCII (parece um quadrado de caracteres)
3. Abra WhatsApp no celular
4. Vá em: **Aparelhos Conectados** → **Conectar Aparelho**
5. Escaneie o QR Code
6. Aguarde a mensagem "Conectado!"

---

## 🔄 Redeploy (Atualizar Código)

Quando fizer alterações:

```
1. Push para o GitHub
2. No EasyPanel: clique em "Redeploy"
3. Aguarde rebuild
4. ✅ Dados são mantidos (graças aos volumes!)
```

**Não precisa fazer login novamente!** 🎉

---

## ❌ Erros Comuns

### **"OpenAI não funciona"**
→ Faltou adicionar `OPENAI_API_KEY` nas variáveis de ambiente

### **"Perdi os dados após redeploy"**
→ Faltou configurar os volumes persistentes

### **"Não consigo ver o QR Code"**
→ Vá em "Logs" e procure por caracteres formando um quadrado

### **"Container não inicia"**
→ Verifique os logs para ver o erro específico

---

## 📋 Checklist Rápido

Antes de fazer deploy:

- [ ] Variável `OPENAI_API_KEY` adicionada
- [ ] 3 volumes configurados (tokens, db.json, out.png)
- [ ] Portas 3000 e 3001 configuradas
- [ ] Build method: Dockerfile

---

## 🆘 Precisa de Mais Detalhes?

Leia o guia completo: **EASYPANEL_DEPLOY.md**

---

## ✅ Tudo Certo!

Se seguiu os 5 passos, seu bot está rodando! 🚀

Teste enviando `/lista` no grupo do WhatsApp.

