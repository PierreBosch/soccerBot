#!/bin/bash

echo "🚀 Iniciando deploy do SoccerBot..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo "Criando .env a partir do .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Configure o arquivo .env com sua chave da OpenAI!${NC}"
    echo "Abra o arquivo .env e adicione sua chave."
    exit 1
fi

# Criar estrutura de pastas se não existir
echo -e "${GREEN}📁 Verificando estrutura de pastas...${NC}"
mkdir -p tokens
touch db.json 2>/dev/null || true

# Fazer backup antes do deploy
echo -e "${GREEN}💾 Criando backup...${NC}"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp db.json "$BACKUP_DIR/" 2>/dev/null || true
cp -r tokens "$BACKUP_DIR/" 2>/dev/null || true
echo -e "${GREEN}✅ Backup criado em: $BACKUP_DIR${NC}"

# Pull das alterações
echo -e "${GREEN}📥 Baixando alterações do repositório...${NC}"
git pull origin main

# Build da imagem
echo -e "${GREEN}🔨 Building Docker image...${NC}"
docker-compose build

# Recriar container (sem perder dados)
echo -e "${GREEN}🔄 Recriando container...${NC}"
docker-compose up -d --force-recreate

# Aguardar container iniciar
echo -e "${GREEN}⏳ Aguardando container iniciar...${NC}"
sleep 5

# Verificar status
echo -e "${GREEN}📊 Status do container:${NC}"
docker-compose ps

# Mostrar logs
echo -e "${GREEN}📋 Últimas linhas do log:${NC}"
docker-compose logs --tail=20

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "Comandos úteis:"
echo "  docker-compose logs -f          # Ver logs em tempo real"
echo "  docker-compose restart          # Reiniciar container"
echo "  docker-compose exec soccerbot bash  # Acessar container"
echo ""
