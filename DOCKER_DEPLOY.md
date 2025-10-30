# 🐳 Deploy com Docker - Guia Completo

## 📋 Problema Resolvido

Este guia explica como fazer deploy do SoccerBot com Docker **sem perder dados** importantes como:
- 🔑 Tokens de autenticação do WhatsApp (pasta `tokens/`)
- 💾 Banco de dados JSON (`db.json`)
- 🖼️ Imagens geradas (`out.png`)
- ⚙️ Variáveis de ambiente (`.env`)

## 🎯 Como Funciona

Usamos **Docker Volumes** para montar arquivos e pastas do host dentro do container. Isso garante que:
- ✅ Os dados persistem entre deploys
- ✅ Você não precisa fazer login no WhatsApp novamente
- ✅ O banco de dados não é resetado
- ✅ As configurações são mantidas

---

## 🚀 Primeira Configuração

### Passo 1: Criar Estrutura de Pastas

```bash
# Criar pasta para tokens (se não existir)
mkdir -p tokens

# Criar arquivo db.json vazio (se não existir)
touch db.json

# Criar arquivo .env com sua chave da OpenAI
cp .env.example .env
nano .env
```

### Passo 2: Configurar o .env

Edite o arquivo `.env` e adicione sua chave da OpenAI:

```bash
OPENAI_API_KEY=sk-proj-sua-chave-real-aqui
```

### Passo 3: Build e Start

```bash
# Build da imagem
docker-compose build

# Iniciar o container
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 🔄 Deploy / Atualização

Quando você fizer alterações no código e quiser atualizar:

```bash
# 1. Fazer pull das alterações
git pull origin main

# 2. Rebuild da imagem (com cache)
docker-compose build

# 3. Recriar o container (SEM perder dados)
docker-compose up -d --force-recreate

# 4. Ver logs para confirmar
docker-compose logs -f soccerbot
```

### ⚠️ Importante sobre Volumes

Os volumes estão configurados para **NÃO serem apagados** durante o redeploy:

```yaml
volumes:
  - ./tokens:/usr/src/app/tokens      # Sessão WhatsApp
  - ./db.json:/usr/src/app/db.json    # Banco de dados
  - ./.env:/usr/src/app/.env:ro       # Variáveis (read-only)
  - ./out.png:/usr/src/app/out.png    # QR Code
```

---

## 📁 Estrutura de Arquivos

```
soccerBot/
├── tokens/              # ✅ Persistido (sessão WhatsApp)
│   └── sessionName/
├── db.json             # ✅ Persistido (banco de dados)
├── out.png             # ✅ Persistido (QR code)
├── .env                # ✅ Persistido (configurações)
├── docker-compose.yml  # Configuração dos volumes
├── Dockerfile          # Build da imagem
└── .dockerignore       # Arquivos ignorados no build
```

---

## 🛠️ Comandos Úteis

### Ver Logs
```bash
# Logs em tempo real
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100

# Logs de um serviço específico
docker-compose logs -f soccerbot
```

### Gerenciar Container
```bash
# Parar o container
docker-compose stop

# Iniciar o container
docker-compose start

# Reiniciar o container
docker-compose restart

# Parar e remover (volumes são mantidos)
docker-compose down

# Ver status
docker-compose ps
```

### Acessar o Container
```bash
# Entrar no container
docker-compose exec soccerbot bash

# Ver processos rodando
docker-compose exec soccerbot pm2 list

# Ver logs do PM2
docker-compose exec soccerbot pm2 logs
```

### Backup de Dados
```bash
# Backup do db.json
cp db.json db.json.backup

# Backup da pasta tokens
tar -czf tokens-backup.tar.gz tokens/

# Backup completo
tar -czf soccerbot-backup-$(date +%Y%m%d).tar.gz tokens/ db.json .env
```

---

## 🔧 Troubleshooting

### Problema: "Não consigo fazer login no WhatsApp"

**Solução:**
```bash
# 1. Parar o container
docker-compose down

# 2. Limpar tokens antigos
rm -rf tokens/*

# 3. Remover out.png
rm out.png

# 4. Iniciar novamente
docker-compose up -d

# 5. Ver QR code nos logs
docker-compose logs -f
```

### Problema: "Banco de dados foi resetado"

**Causa:** Volume não está montado corretamente

**Solução:**
```bash
# Verificar se o db.json existe no host
ls -la db.json

# Verificar volumes montados
docker-compose exec soccerbot ls -la /usr/src/app/

# Se necessário, restaurar backup
cp db.json.backup db.json
docker-compose restart
```

### Problema: "OpenAI não funciona"

**Solução:**
```bash
# Verificar se .env está montado
docker-compose exec soccerbot cat /usr/src/app/.env

# Se estiver vazio, criar .env no host
nano .env
# Adicionar: OPENAI_API_KEY=sk-proj-...

# Reiniciar
docker-compose restart
```

### Problema: "Container não inicia"

**Solução:**
```bash
# Ver logs de erro
docker-compose logs

# Verificar portas em uso
netstat -tuln | grep -E '3000|3001'

# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔒 Segurança

### Arquivos Sensíveis

⚠️ **NUNCA commite estes arquivos:**
- `.env` - Contém chave da API
- `tokens/` - Contém sessão do WhatsApp
- `db.json` - Contém dados dos usuários

Todos já estão no `.gitignore` e `.dockerignore`.

### Permissões

```bash
# Definir permissões corretas
chmod 600 .env
chmod 700 tokens/
chmod 644 db.json
```

---

## 📊 Monitoramento

### Verificar Saúde do Container

```bash
# Ver uso de recursos
docker stats soccerbot

# Ver processos
docker-compose exec soccerbot pm2 list

# Ver memória
docker-compose exec soccerbot pm2 show futebot-start
```

### Logs Estruturados

```bash
# Salvar logs em arquivo
docker-compose logs > logs-$(date +%Y%m%d).txt

# Monitorar erros
docker-compose logs -f | grep -i error
```

---

## 🚀 Deploy em Produção

### Servidor VPS/Cloud

```bash
# 1. Clonar repositório
git clone https://github.com/PierreBosch/soccerBot.git
cd soccerBot

# 2. Configurar .env
cp .env.example .env
nano .env

# 3. Criar estrutura
mkdir -p tokens
touch db.json

# 4. Build e start
docker-compose up -d

# 5. Verificar
docker-compose ps
docker-compose logs -f
```

### Atualização Automática (CI/CD)

```bash
#!/bin/bash
# Script de deploy automático

cd /path/to/soccerBot

# Pull das alterações
git pull origin main

# Rebuild e restart
docker-compose build
docker-compose up -d --force-recreate

# Verificar saúde
sleep 10
docker-compose ps

echo "Deploy concluído!"
```

---

## 📝 Checklist de Deploy

- [ ] Arquivo `.env` configurado com chave da OpenAI
- [ ] Pasta `tokens/` criada
- [ ] Arquivo `db.json` existe
- [ ] Docker e Docker Compose instalados
- [ ] Portas 3000 e 3001 disponíveis
- [ ] Backup dos dados importantes feito
- [ ] `.gitignore` configurado corretamente
- [ ] Volumes montados no `docker-compose.yml`

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Verifique os volumes: `docker-compose exec soccerbot ls -la`
3. Verifique o PM2: `docker-compose exec soccerbot pm2 list`
4. Restaure backup se necessário
5. Recrie o container: `docker-compose up -d --force-recreate`

---

## 🎉 Pronto!

Agora você pode fazer deploy quantas vezes quiser sem perder:
- ✅ Sessão do WhatsApp
- ✅ Banco de dados
- ✅ Configurações
- ✅ Imagens geradas

**Deploy seguro e sem dor de cabeça!** 🚀

