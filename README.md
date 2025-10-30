# FuteBot - Evolution API Edition

Bot do WhatsApp para gerenciar peladas de futebol, agora usando **Evolution API v2**.

## 🚀 Início Rápido

### Com Docker Compose (Recomendado)

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 2. Iniciar serviços
npm run docker:up

# 3. Ver logs
npm run docker:logs
```

### Sem Docker

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
cp .env.example .env

# 3. Iniciar JSON Server (terminal 1)
npm run db

# 4. Iniciar bot (terminal 2)
npm start
```

## 📚 Documentação

Toda a documentação está na pasta [`docs/`](./docs/):

### Guias Principais
- [**README Evolution**](./docs/README_EVOLUTION.md) - Guia completo do bot
- [**Guia Docker Compose**](./docs/DOCKER_COMPOSE_GUIDE.md) - Como usar Docker Compose
- [**Migração Evolution API**](./docs/EVOLUTION_API_MIGRATION.md) - Detalhes da migração

### Deploy
- [**Docker Deploy**](./docs/DOCKER_DEPLOY.md) - Deploy com Docker
- [**EasyPanel Deploy**](./docs/EASYPANEL_DEPLOY.md) - Deploy no EasyPanel
- [**EasyPanel Quickstart**](./docs/EASYPANEL_QUICKSTART.md) - Guia rápido EasyPanel

### Configuração
- [**Configuração OpenAI**](./docs/CONFIGURACAO_OPENAI.md) - Setup da integração OpenAI
- [**Testing Checklist**](./docs/TESTING_CHECKLIST.md) - Checklist de testes

### Referência
- [**Migration Summary**](./docs/MIGRATION_SUMMARY.md) - Sumário da migração
- [**Fix DB Connection**](./docs/FIX_DB_CONNECTION.md) - Troubleshooting DB

## 🎯 Comandos Principais

### Futebol
- `/add` - Adicionar jogador
- `/lista` - Ver lista
- `/fora` - Remover jogador
- `/escalacao` - Ver times

### Churrasco
- `/add-churras` - Adicionar ao churrasco
- `/lista-churras` - Ver lista churrasco

### Financeiro
- `/serasa` - Gerar lista de devedores
- `/pago|Nome` - Marcar como pago

### Informações
- `/ajuda` - Ver todos os comandos

## 🐳 Scripts Docker

```bash
npm run docker:build      # Build das imagens
npm run docker:up          # Iniciar serviços
npm run docker:down        # Parar serviços
npm run docker:logs        # Ver logs
npm run docker:logs:app    # Logs do app
npm run docker:logs:db     # Logs do DB
npm run docker:restart     # Reiniciar serviços
npm run docker:ps          # Status dos containers
npm run docker:clean       # Parar e limpar volumes
```

## 🏗️ Arquitetura

```
Evolution API → Webhook → FuteBot (Express) → JSON Server
```

**Serviços Docker:**
- `app` - FuteBot (porta 3000)
- `db` - JSON Server (porta 3001)

## ⚙️ Variáveis de Ambiente

```env
EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua-api-key
EVOLUTION_INSTANCE_NAME=sua-instancia
WEBHOOK_URL=https://seu-dominio.com/webhook/evolution
OPENAI_API_KEY=sk-proj-sua-chave
PORT=3000
```

## 🧪 Testes

```bash
# Health check
curl http://localhost:3000/health

# Teste de envio
curl -X POST http://localhost:3000/test/send \
  -H "Content-Type: application/json" \
  -d '{"to": "5548999999999@s.whatsapp.net", "message": "Teste!"}'
```

## 📝 Licença

ISC

---

**Versão**: 2.0.0 (Evolution API + Docker Compose)  
**Última atualização**: 30 de Outubro de 2025
