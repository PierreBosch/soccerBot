# FuteBot - Evolution API Edition

Bot do WhatsApp para gerenciar peladas de futebol, agora usando **Evolution API v2**.

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua-api-key
EVOLUTION_INSTANCE_NAME=sua-instancia
WEBHOOK_URL=https://seu-dominio.com/webhook/evolution
OPENAI_API_KEY=sk-proj-sua-chave
```

### 3. Iniciar o Bot

```bash
# Iniciar JSON Server
npm run db

# Em outro terminal, iniciar o bot
npm start
```

### 4. Configurar Webhook

Configure o webhook na Evolution API para:
```
https://seu-dominio.com/webhook/evolution
```

Eventos: `messages.upsert`

## 📚 Documentação

- [Guia de Migração](./EVOLUTION_API_MIGRATION.md) - Documentação completa da migração
- [Configuração OpenAI](./CONFIGURACAO_OPENAI.md) - Setup da integração OpenAI
- [Deploy Docker](./DOCKER_DEPLOY.md) - Deploy com Docker
- [Deploy EasyPanel](./EASYPANEL_DEPLOY.md) - Deploy no EasyPanel

## 🎯 Comandos Disponíveis

### Futebol
- `/add` - Adicionar jogador
- `/goleiro` - Adicionar goleiro
- `/lista` - Ver lista de jogadores
- `/fora` - Remover jogador
- `/limpar` - Limpar lista
- `/escalacao` - Ver escalação dos times
- `/mvp` - Criar enquete de MVP

### Churrasco
- `/add-churras` - Adicionar ao churrasco
- `/add-churras-coca` - Adicionar ao churrasco com coca
- `/fora-churras` - Remover do churrasco
- `/lista-churras` - Ver lista do churrasco
- `/limpar-churras` - Limpar lista do churrasco
- `/convidado-churras|Nome` - Adicionar convidado

### Financeiro
- `/serasa` - Gerar lista de devedores
- `/pago|Nome` - Marcar como pago
- `/notificar` - Notificar devedores
- `/limpar-serasa` - Limpar lista de devedores

### Informações
- `/pix` - Ver chave PIX
- `/jogo` - Ver preço do jogo
- `/churrasco` - Ver preço do churrasco
- `/coca` - Ver preço da coca
- `/cardapio` - Ver cardápio
- `/ajuda` - Ver todos os comandos

### Grupos
- `/configurar` - Configurar grupo
- `/vou` - Confirmar presença
- `/naovou` - Cancelar presença
- `/quemvai` - Ver quem confirmou

## 🏗️ Arquitetura

```
Evolution API → Webhook → FuteBot Server → Processa Comando → Evolution API
```

### Componentes

- **src/server.js**: Servidor Express (webhook endpoint)
- **src/services/evolution-client.js**: Cliente da Evolution API
- **src/adapters/message-adapter.js**: Adaptador de mensagens
- **src/commands/**: Comandos do bot
- **db.json**: Banco de dados JSON

## 🧪 Testes

### Health Check

```bash
curl http://localhost:3000/health
```

### Enviar Mensagem de Teste

```bash
curl -X POST http://localhost:3000/test/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5548999999999@s.whatsapp.net",
    "message": "Teste!"
  }'
```

### Testar Localmente com ngrok

```bash
ngrok http 3000
```

Configure o webhook na Evolution API para a URL do ngrok.

## 🐳 Docker

### Build e Run

```bash
docker-compose up -d
```

### Logs

```bash
docker-compose logs -f
```

### Parar

```bash
docker-compose down
```

## 📦 Deploy

### PM2 (Produção)

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### EasyPanel

Consulte [EASYPANEL_DEPLOY.md](./EASYPANEL_DEPLOY.md) para instruções detalhadas.

## 🔧 Troubleshooting

### Webhook não recebe mensagens

1. Verifique se o webhook está configurado na Evolution API
2. Teste o endpoint: `curl https://seu-dominio.com/health`
3. Verifique os logs: `pm2 logs futebot-start`

### Erro ao enviar mensagem

1. Verifique `EVOLUTION_API_KEY` no `.env`
2. Teste a conexão com a Evolution API
3. Verifique se a instância está conectada

### JSON Server não conecta

1. Verifique se `db.json` existe
2. Reinicie o processo: `pm2 restart futebot-db`
3. Verifique a porta 3001

## 📝 Licença

ISC

## 🤝 Contribuindo

Pull requests são bem-vindos!

---

**Versão**: 2.0.0 (Evolution API)  
**Última atualização**: 30 de Outubro de 2025

