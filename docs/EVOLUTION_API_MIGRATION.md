# Migração para Evolution API

Este documento descreve a migração do bot de `wppconnect` para **Evolution API v2**.

## 📋 Índice

- [O que mudou](#o-que-mudou)
- [Arquitetura Nova](#arquitetura-nova)
- [Configuração](#configuração)
- [Instalação](#instalação)
- [Configurar Webhook na Evolution API](#configurar-webhook-na-evolution-api)
- [Deploy](#deploy)
- [Testes Locais](#testes-locais)
- [Troubleshooting](#troubleshooting)
- [Diferenças Técnicas](#diferenças-técnicas)

---

## 🔄 O que mudou

### Antes (wppconnect)
- Bot gerenciava conexão WhatsApp diretamente
- Precisava do Chrome/Puppeteer instalado
- QR Code gerado pelo próprio bot
- Sessão armazenada localmente em `tokens/`
- Polling de mensagens via `client.onMessage()`

### Agora (Evolution API)
- Evolution API gerencia a conexão WhatsApp
- Não precisa mais de Chrome/Puppeteer
- QR Code gerenciado pela Evolution API
- Sessão gerenciada pela Evolution API
- Webhooks para receber mensagens em tempo real

---

## 🏗️ Arquitetura Nova

```
┌─────────────────┐
│   WhatsApp      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Evolution API   │ ← Gerencia conexão WhatsApp
└────────┬────────┘
         │
         │ Webhook (messages.upsert)
         ↓
┌─────────────────┐
│   FuteBot       │ ← Servidor Express (porta 3000)
│  (src/server.js)│
└────────┬────────┘
         │
         │ Processa comandos
         ↓
┌─────────────────┐
│  Evolution API  │ ← Envia respostas via API REST
│  (sendText)     │
└─────────────────┘
```

### Componentes

1. **Evolution API**: Gerencia conexão WhatsApp e envia webhooks
2. **FuteBot Server** (`src/server.js`): Servidor Express que recebe webhooks
3. **Evolution Client** (`src/services/evolution-client.js`): Wrapper para API REST
4. **Message Adapter** (`src/adapters/message-adapter.js`): Converte formatos

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure as variáveis:

```env
# OpenAI (mantém como antes)
OPENAI_API_KEY=sk-proj-sua-chave-aqui

# Evolution API
EVOLUTION_API_URL=https://ameixa-evolution-api.h5zms9.easypanel.host
EVOLUTION_API_KEY=35e8bc3c-a2d5-4e6e-8ef1-7da74663c7ba
EVOLUTION_INSTANCE_NAME=ameixa

# Webhook
WEBHOOK_URL=https://seu-dominio.com/webhook/evolution

# Porta do servidor
PORT=3000
```

### 2. Obter Credenciais Evolution API

1. Acesse o painel da Evolution API
2. Navegue até **Settings** ou **API Keys**
3. Copie a **API Key**
4. Anote o nome da sua **Instance**

---

## 📦 Instalação

### Instalar Dependências

```bash
npm install
```

### Dependências Novas

- `express`: Servidor HTTP
- `body-parser`: Parse de JSON nos webhooks

### Dependências Removidas

- `@wppconnect-team/wppconnect`: Não usa mais
- `sharp`: Não precisa mais (era para processar QR Code)

---

## 🔗 Configurar Webhook na Evolution API

### Opção 1: Via Interface Web

1. Acesse o painel da Evolution API
2. Vá em **Instances** → Sua instância → **Webhooks**
3. Configure:
   - **Enabled**: ✅ Ativado
   - **URL**: `https://managamental-diuretically-princeton.ngrok-free.dev/api/webhook/evolution`
   - **Events**: Selecione `messages.upsert` ou `message_upsert`
   - **Webhook by Events**: ✅ Ativado (se disponível)

### Opção 2: Via API REST

```bash
curl -X POST https://ameixa-evolution-api.h5zms9.easypanel.host/webhook/set/ameixa \
  -H "Content-Type: application/json" \
  -H "apikey: 35e8bc3c-a2d5-4e6e-8ef1-7da74663c7ba" \
  -d '{
    "enabled": true,
    "url": "https://seu-dominio.com/webhook/evolution",
    "webhookByEvents": true,
    "events": ["messages.upsert"]
  }'
```

### Verificar Webhook

```bash
curl -X GET https://ameixa-evolution-api.h5zms9.easypanel.host/webhook/find/ameixa \
  -H "apikey: 35e8bc3c-a2d5-4e6e-8ef1-7da74663c7ba"
```

---

## 🚀 Deploy

### Deploy Local

```bash
# Iniciar JSON Server (terminal 1)
npm run db

# Iniciar FuteBot (terminal 2)
npm start
```

### Deploy com PM2

```bash
pm2 start ecosystem.config.js
pm2 logs futebot-start
```

### Deploy com Docker

```bash
docker-compose up -d
docker-compose logs -f
```

### Deploy no EasyPanel

1. **Atualizar variáveis de ambiente** no painel:
   - `EVOLUTION_API_URL`
   - `EVOLUTION_API_KEY`
   - `EVOLUTION_INSTANCE_NAME`
   - `WEBHOOK_URL` (URL pública do seu app)
   - `OPENAI_API_KEY`

2. **Configurar portas**:
   - Porta 3000 (servidor Express)
   - Porta 3001 (JSON Server)

3. **Volumes** (manter):
   - `/usr/src/app/db.json` → Volume `db`
   - `/usr/src/app/.env` → Volume `env` (read-only)

4. **Remover volume** `tokens` (não precisa mais)

5. **Deploy** e aguardar inicialização

6. **Configurar webhook** na Evolution API apontando para:
   ```
   https://seu-app.easypanel.host/webhook/evolution
   ```

---

## 🧪 Testes Locais

### 1. Expor Localhost com ngrok

```bash
ngrok http 3000
```

Você receberá uma URL como:
```
https://abc123.ngrok.io
```

### 2. Configurar Webhook

Configure o webhook na Evolution API para:
```
https://abc123.ngrok.io/webhook/evolution
```

### 3. Testar Envio de Mensagem

```bash
curl -X POST http://localhost:3000/test/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5548999999999@s.whatsapp.net",
    "message": "Teste do bot!"
  }'
```

### 4. Monitorar Logs

```bash
# Com npm
npm start

# Com PM2
pm2 logs futebot-start

# Com Docker
docker-compose logs -f
```

### 5. Health Check

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-30T12:00:00.000Z",
  "service": "FuteBot Evolution API"
}
```

---

## 🔧 Troubleshooting

### Problema: Webhook não recebe mensagens

**Solução:**
1. Verifique se o webhook está configurado corretamente:
   ```bash
   curl -X GET https://sua-evolution-api.com/webhook/find/sua-instancia \
     -H "apikey: sua-api-key"
   ```

2. Verifique se a URL está acessível publicamente:
   ```bash
   curl https://seu-dominio.com/health
   ```

3. Verifique os logs do servidor:
   ```bash
   pm2 logs futebot-start
   ```

### Problema: Erro 401 ao enviar mensagem

**Solução:**
- Verifique se `EVOLUTION_API_KEY` está correta no `.env`
- Teste a API Key manualmente:
  ```bash
  curl -X GET https://sua-evolution-api.com/instance/connectionState/sua-instancia \
    -H "apikey: sua-api-key"
  ```

### Problema: Mensagens não são processadas

**Solução:**
1. Verifique se o adaptador está convertendo corretamente:
   - Olhe os logs para ver a mensagem adaptada
   - Compare com o formato esperado

2. Verifique se o comando está registrado em `src/commands/index.js`

3. Teste o comando manualmente enviando uma mensagem no WhatsApp

### Problema: JSON Server não conecta

**Solução:**
1. Verifique se o processo `futebot-db` está rodando:
   ```bash
   pm2 list
   ```

2. Verifique se `db.json` existe:
   ```bash
   ls -la db.json
   ```

3. Reinicie o JSON Server:
   ```bash
   pm2 restart futebot-db
   ```

### Problema: Container Docker não inicia

**Solução:**
1. Verifique os logs:
   ```bash
   docker-compose logs
   ```

2. Verifique se as variáveis de ambiente estão configuradas:
   ```bash
   docker-compose config
   ```

3. Reconstrua a imagem:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

---

## 📊 Diferenças Técnicas

### Formato de Mensagem

#### wppconnect
```javascript
{
  from: "5548999999999@c.us",
  body: "/lista",
  sender: {
    id: "5548999999999@c.us",
    pushname: "João"
  },
  type: "chat",
  isGroupMsg: false
}
```

#### Evolution API (webhook)
```javascript
{
  event: "messages.upsert",
  data: {
    key: {
      remoteJid: "5548999999999@s.whatsapp.net",
      fromMe: false,
      id: "ABC123"
    },
    message: {
      conversation: "/lista"
    },
    pushName: "João",
    messageTimestamp: 1234567890
  }
}
```

#### Adaptado (compatível com wppconnect)
```javascript
{
  from: "5548999999999@s.whatsapp.net",
  body: "/lista",
  sender: {
    id: "5548999999999@s.whatsapp.net",
    pushname: "João"
  },
  type: "chat",
  isGroupMsg: false
}
```

### Envio de Mensagem

#### wppconnect
```javascript
await client.sendText(to, message);
```

#### Evolution API
```javascript
// Via wrapper (compatível)
await client.sendText(to, message);

// Direto na API
await axios.post(
  'https://api.com/message/sendText/instance',
  { number: to, text: message },
  { headers: { apikey: 'key' } }
);
```

### Identificadores

| Tipo | wppconnect | Evolution API |
|------|-----------|---------------|
| Usuário | `5548999999999@c.us` | `5548999999999@s.whatsapp.net` |
| Grupo | `120363144278270676@g.us` | `120363144278270676@g.us` |

---

## 🎯 Benefícios da Migração

1. **Container mais leve**: Não precisa mais do Chrome (~500MB)
2. **Mais estável**: Evolution API gerencia reconexão automaticamente
3. **Mais rápido**: Webhooks são mais eficientes que polling
4. **Escalável**: Pode ter múltiplas instâncias do bot
5. **Manutenção**: Não precisa gerenciar sessão do WhatsApp

---

## 📚 Recursos

- [Evolution API Docs](https://docs.evoapicloud.com/)
- [Evolution API GitHub](https://github.com/EvolutionAPI/evolution-api)
- [Postman Collection](https://www.postman.com/agenciadgcode/evolution-api/documentation/1wphumy/evolution-api-v2-2-0-v2-2-1)

---

## 🤝 Suporte

Se encontrar problemas:

1. Verifique os logs: `pm2 logs futebot-start`
2. Teste o health check: `curl http://localhost:3000/health`
3. Verifique a configuração do webhook na Evolution API
4. Consulte a seção [Troubleshooting](#troubleshooting)

---

**Data da Migração**: 30 de Outubro de 2025  
**Versão**: 2.0.0 (Evolution API)

