# Guia Docker Compose - FuteBot

Este guia explica como usar Docker Compose para executar o FuteBot sem PM2.

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Comandos](#comandos)
- [Serviços](#serviços)
- [Volumes](#volumes)
- [Healthchecks](#healthchecks)
- [Logs](#logs)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

O projeto usa **multi-container** com Docker Compose:

```
┌─────────────────────────────────────────┐
│         Docker Compose                  │
│                                         │
│  ┌──────────────┐   ┌──────────────┐  │
│  │   app        │   │     db       │  │
│  │ (FuteBot)    │◄──│ (JSON Server)│  │
│  │ Porta: 3000  │   │ Porta: 3001  │  │
│  └──────────────┘   └──────────────┘  │
│         │                   │          │
│         │                   │          │
│    .env (ro)           db.json         │
└─────────────────────────────────────────┘
```

### Serviços

1. **`db`** - JSON Server
   - Container: `soccerbot-db`
   - Porta: 3001
   - Dockerfile: `Dockerfile.db`
   - Volume: `db.json`

2. **`app`** - FuteBot (Express)
   - Container: `soccerbot-app`
   - Porta: 3000
   - Dockerfile: `Dockerfile`
   - Volume: `.env` (read-only)
   - Depende de: `db` (com healthcheck)

---

## 📦 Pré-requisitos

### Instalar Docker

**macOS:**
```bash
brew install --cask docker
```

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

**Windows:**
- Baixar [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Verificar Instalação

```bash
docker --version
docker-compose --version
```

---

## ⚙️ Configuração

### 1. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env`:
```env
# Evolution API
EVOLUTION_API_URL=https://ameixa-evolution-api.h5zms9.easypanel.host
EVOLUTION_API_KEY=35e8bc3c-a2d5-4e6e-8ef1-7da74663c7ba
EVOLUTION_INSTANCE_NAME=ameixa
WEBHOOK_URL=https://seu-dominio.com/webhook/evolution

# OpenAI
OPENAI_API_KEY=sk-proj-sua-chave

# Porta (opcional, padrão: 3000)
PORT=3000
```

### 2. Garantir que db.json Existe

```bash
# Se não existir, criar:
cat > db.json << 'EOF'
{
  "players": [],
  "goalKeepers": [],
  "barbecueEaters": [],
  "debtors": [],
  "groups": [],
  "lists": [],
  "participants": []
}
EOF
```

---

## 🚀 Comandos

### Build

Construir as imagens:
```bash
npm run docker:build
# ou
docker-compose build
```

**Rebuild sem cache:**
```bash
docker-compose build --no-cache
```

### Iniciar

Iniciar todos os serviços em background:
```bash
npm run docker:up
# ou
docker-compose up -d
```

**Iniciar com logs visíveis:**
```bash
docker-compose up
```

### Parar

Parar todos os serviços:
```bash
npm run docker:down
# ou
docker-compose down
```

**Parar e remover volumes:**
```bash
npm run docker:clean
# ou
docker-compose down -v
```

### Status

Ver status dos containers:
```bash
npm run docker:ps
# ou
docker-compose ps
```

Saída esperada:
```
NAME              IMAGE                    STATUS         PORTS
soccerbot-app     soccerbot-app            Up 2 minutes   0.0.0.0:3000->3000/tcp
soccerbot-db      soccerbot-db             Up 2 minutes   0.0.0.0:3001->3001/tcp
```

### Logs

**Todos os serviços:**
```bash
npm run docker:logs
# ou
docker-compose logs -f
```

**Apenas app:**
```bash
npm run docker:logs:app
# ou
docker-compose logs -f app
```

**Apenas db:**
```bash
npm run docker:logs:db
# ou
docker-compose logs -f db
```

**Últimas 100 linhas:**
```bash
docker-compose logs --tail=100
```

### Restart

**Todos os serviços:**
```bash
npm run docker:restart
# ou
docker-compose restart
```

**Apenas app:**
```bash
npm run docker:restart:app
# ou
docker-compose restart app
```

**Apenas db:**
```bash
npm run docker:restart:db
# ou
docker-compose restart db
```

### Executar Comandos

**Shell no container app:**
```bash
docker-compose exec app sh
```

**Shell no container db:**
```bash
docker-compose exec db sh
```

**Executar comando específico:**
```bash
docker-compose exec app node --version
docker-compose exec db cat db.json
```

---

## 🔧 Serviços Detalhados

### Serviço: `db` (JSON Server)

**Configuração:**
```yaml
db:
  build:
    context: .
    dockerfile: Dockerfile.db
  container_name: soccerbot-db
  restart: unless-stopped
  ports:
    - "3001:3001"
  volumes:
    - ./db.json:/usr/src/app/db.json
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001"]
    interval: 10s
    timeout: 5s
    retries: 3
    start_period: 5s
```

**Características:**
- Imagem base: `node:22-alpine` (leve)
- JSON Server instalado globalmente
- Executa `init-db.sh` antes de iniciar
- Healthcheck a cada 10 segundos
- Restart automático

**Acessar:**
```bash
curl http://localhost:3001
curl http://localhost:3001/players
```

### Serviço: `app` (FuteBot)

**Configuração:**
```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: soccerbot-app
  restart: unless-stopped
  ports:
    - "3000:3000"
  volumes:
    - ./.env:/usr/src/app/.env:ro
  environment:
    - NODE_ENV=production
    - JSON_SERVER_URL=http://db:3001
  depends_on:
    db:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s
```

**Características:**
- Imagem base: `node:22`
- Aguarda `db` estar saudável antes de iniciar
- Variável `JSON_SERVER_URL` aponta para serviço `db`
- Healthcheck a cada 30 segundos
- Restart automático

**Acessar:**
```bash
curl http://localhost:3000/health
```

---

## 💾 Volumes

### Volume: `db.json`

**Propósito:** Persistir dados do JSON Server

**Montagem:**
```yaml
volumes:
  - ./db.json:/usr/src/app/db.json
```

**Backup:**
```bash
cp db.json db.json.backup
```

**Restaurar:**
```bash
cp db.json.backup db.json
docker-compose restart db
```

### Volume: `.env`

**Propósito:** Variáveis de ambiente

**Montagem:**
```yaml
volumes:
  - ./.env:/usr/src/app/.env:ro  # read-only
```

**Atualizar:**
```bash
# Editar .env
nano .env

# Reiniciar app para aplicar
docker-compose restart app
```

---

## 🏥 Healthchecks

### Healthcheck do `db`

**Comando:**
```bash
wget --quiet --tries=1 --spider http://localhost:3001
```

**Verificar manualmente:**
```bash
docker-compose exec db wget --quiet --tries=1 --spider http://localhost:3001 && echo "OK" || echo "FAIL"
```

**Status:**
```bash
docker inspect soccerbot-db --format='{{.State.Health.Status}}'
```

### Healthcheck do `app`

**Comando:**
```bash
wget --quiet --tries=1 --spider http://localhost:3000/health
```

**Verificar manualmente:**
```bash
curl http://localhost:3000/health
```

**Status:**
```bash
docker inspect soccerbot-app --format='{{.State.Health.Status}}'
```

---

## 📊 Logs

### Estrutura dos Logs

**JSON Server (db):**
```
⚠️  db.json não encontrado. Criando arquivo inicial...
✅ db.json criado com sucesso!
JSON Server started on http://0.0.0.0:3001
```

**FuteBot (app):**
```
🚀 Iniciando FuteBot com Evolution API...
🔍 Aguardando JSON Server iniciar em http://db:3001...
✅ JSON Server conectado com sucesso!
✅ Cliente Evolution API inicializado
✅ Servidor rodando na porta 3000
📡 Webhook endpoint: http://localhost:3000/webhook/evolution
🏥 Health check: http://localhost:3000/health
🤖 FuteBot pronto para receber mensagens!
```

### Filtrar Logs

**Apenas erros:**
```bash
docker-compose logs | grep "❌\|ERROR\|Error"
```

**Apenas sucessos:**
```bash
docker-compose logs | grep "✅"
```

**Por timestamp:**
```bash
docker-compose logs --since 10m  # últimos 10 minutos
docker-compose logs --since 2024-01-30T10:00:00
```

---

## 🔍 Troubleshooting

### Problema: Container não inicia

**Verificar logs:**
```bash
docker-compose logs app
docker-compose logs db
```

**Verificar status:**
```bash
docker-compose ps
```

**Rebuild:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problema: `db.json` não persiste

**Verificar montagem:**
```bash
docker-compose exec db ls -la /usr/src/app/
```

**Verificar permissões:**
```bash
ls -la db.json
chmod 666 db.json
```

**Verificar conteúdo:**
```bash
docker-compose exec db cat /usr/src/app/db.json
```

### Problema: App não conecta ao DB

**Verificar rede:**
```bash
docker network ls
docker network inspect soccerbot_soccerbot-network
```

**Verificar DNS:**
```bash
docker-compose exec app ping db
docker-compose exec app wget -O- http://db:3001
```

**Verificar variável de ambiente:**
```bash
docker-compose exec app env | grep JSON_SERVER_URL
```

### Problema: Healthcheck falha

**Verificar healthcheck do db:**
```bash
docker inspect soccerbot-db | grep -A 10 Health
```

**Verificar healthcheck do app:**
```bash
docker inspect soccerbot-app | grep -A 10 Health
```

**Testar manualmente:**
```bash
curl http://localhost:3001
curl http://localhost:3000/health
```

### Problema: Porta já em uso

**Verificar portas:**
```bash
lsof -i :3000
lsof -i :3001
```

**Matar processo:**
```bash
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:3001)
```

**Ou alterar porta no docker-compose.yml:**
```yaml
ports:
  - "3002:3000"  # Porta externa diferente
```

### Problema: Imagem muito grande

**Ver tamanho:**
```bash
docker images | grep soccerbot
```

**Limpar cache:**
```bash
docker system prune -a
```

**Rebuild:**
```bash
docker-compose build --no-cache
```

---

## 🎯 Melhores Práticas

### 1. Sempre usar `.env`

Nunca hardcode credenciais no código ou docker-compose.yml.

### 2. Backup regular do `db.json`

```bash
# Adicionar ao crontab
0 2 * * * cp /path/to/db.json /path/to/backups/db.json.$(date +\%Y\%m\%d)
```

### 3. Monitorar logs

```bash
# Em produção, usar ferramenta de log aggregation
docker-compose logs -f | tee -a logs/futebot.log
```

### 4. Atualizar imagens

```bash
# Periodicamente
docker-compose pull
docker-compose up -d
```

### 5. Limpar recursos não usados

```bash
# Semanal
docker system prune -f
```

---

## 📚 Recursos

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Docker Healthcheck](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Docker Networking](https://docs.docker.com/network/)

---

## 🆚 Comparação: PM2 vs Docker Compose

| Aspecto | PM2 | Docker Compose |
|---------|-----|----------------|
| **Gerenciamento** | Dentro do container | Orquestração externa |
| **Logs** | `pm2 logs` | `docker-compose logs` |
| **Restart** | PM2 gerencia | Docker gerencia |
| **Healthcheck** | Básico | Nativo e robusto |
| **Escalabilidade** | Limitada | Fácil (replicas) |
| **Separação** | Processos | Containers |
| **Complexidade** | Média | Baixa |
| **Overhead** | Pequeno | Mínimo |
| **Portabilidade** | Depende do Node | Universal |

---

## ✅ Checklist de Deploy

- [ ] `.env` configurado
- [ ] `db.json` existe
- [ ] `docker-compose build` sem erros
- [ ] `docker-compose up -d` inicia serviços
- [ ] `docker-compose ps` mostra ambos "Up"
- [ ] `curl http://localhost:3001` retorna JSON
- [ ] `curl http://localhost:3000/health` retorna OK
- [ ] Logs sem erros críticos
- [ ] Webhook configurado na Evolution API
- [ ] Teste de mensagem funciona

---

**Versão**: 2.0.0  
**Última Atualização**: 30 de Outubro de 2025

