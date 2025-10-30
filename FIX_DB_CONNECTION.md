# 🔧 Correção: ECONNREFUSED 127.0.0.1:3001

## ❌ Problema

Erro ao iniciar o bot:
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Causa:** O arquivo `db.json` não existia, impedindo o JSON Server de iniciar.

---

## ✅ Solução Implementada

### **1. db.json Inicial Criado** 📁

Adicionado `db.json` com estrutura inicial:
```json
{
  "players": [],
  "goalKeepers": [],
  "barbecueEaters": [],
  "debtors": [],
  "groups": [],
  "lists": [],
  "participants": []
}
```

### **2. Script de Inicialização** 🚀

Criado `init-db.sh` que:
- ✅ Verifica se `db.json` existe
- ✅ Cria automaticamente se não existir
- ✅ Define permissões corretas

### **3. Aguardar JSON Server** ⏳

Modificado `src/index.js` para:
- ✅ Aguardar JSON Server iniciar antes do bot
- ✅ Retry automático (30 tentativas)
- ✅ Logs informativos
- ✅ Erro claro se JSON Server não iniciar

### **4. .gitignore Atualizado** 📝

- ✅ `db.json` agora é commitado como template
- ✅ Dados de produção são mantidos via volumes Docker

---

## 🚀 Como Funciona Agora

### **Fluxo de Inicialização:**

```
1. Container inicia
   ↓
2. PM2 inicia 2 processos:
   - futebot-db (JSON Server na porta 3001)
   - futebot-start (Bot WhatsApp)
   ↓
3. Bot aguarda JSON Server estar pronto
   ↓
4. Conexão estabelecida ✅
   ↓
5. Bot funciona normalmente! 🎉
```

---

## 📋 O que Mudou

| Arquivo | Mudança | Motivo |
|---------|---------|--------|
| `db.json` | ✅ Criado | Template inicial do banco |
| `init-db.sh` | ✅ Criado | Garante db.json existe |
| `src/index.js` | ✅ Modificado | Aguarda JSON Server |
| `.gitignore` | ✅ Atualizado | Permite commitar db.json |

---

## 🔄 Deploy no EasyPanel

### **Primeira vez (se já deployou antes):**

1. Faça redeploy no EasyPanel
2. O `db.json` será criado automaticamente
3. O bot aguardará o JSON Server iniciar
4. Tudo funcionará! ✅

### **Volumes (Importante):**

Certifique-se que o volume está configurado:
```
Mount Path: /usr/src/app/db.json
Volume Name: soccerbot-db
Type: Named Volume
```

---

## 🧪 Como Testar

### **Verificar no Shell do Container:**

```bash
# 1. Ver processos PM2
pm2 list
# Deve mostrar futebot-start e futebot-db online

# 2. Verificar db.json
ls -la /usr/src/app/db.json
# Deve existir

# 3. Testar JSON Server
curl http://localhost:3001
# Deve retornar JSON

# 4. Ver logs
pm2 logs
# Deve mostrar "✅ JSON Server conectado com sucesso!"
```

---

## ⚠️ Troubleshooting

### **Se ainda der erro:**

```bash
# No shell do container:

# 1. Verificar se db.json existe
ls -la /usr/src/app/db.json

# 2. Se não existir, criar manualmente
echo '{"players":[],"goalKeepers":[],"barbecueEaters":[],"debtors":[],"groups":[],"lists":[],"participants":[]}' > /usr/src/app/db.json

# 3. Reiniciar PM2
pm2 restart all

# 4. Ver logs
pm2 logs --lines 50
```

---

## 🎯 Benefícios

- ✅ **Erro ECONNREFUSED resolvido**
- ✅ **db.json criado automaticamente**
- ✅ **Bot aguarda JSON Server estar pronto**
- ✅ **Logs informativos para debug**
- ✅ **Funciona em qualquer ambiente (EasyPanel, Docker, local)**

---

## 📚 Referências

- Erro original: `ECONNREFUSED 127.0.0.1:3001`
- Causa: `db.json` não existia
- Solução: Template inicial + script de inicialização + retry logic

**Problema resolvido permanentemente!** 🎉

