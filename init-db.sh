#!/bin/bash

# Script de inicialização para garantir que db.json existe
# Este script é executado antes do PM2 iniciar

DB_FILE="/usr/src/app/db.json"

echo "🔍 Verificando db.json..."

if [ ! -f "$DB_FILE" ]; then
    echo "⚠️  db.json não encontrado. Criando arquivo inicial..."
    cat > "$DB_FILE" << 'EOF'
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
    echo "✅ db.json criado com sucesso!"
else
    echo "✅ db.json já existe"
fi

# Garantir permissões corretas
chmod 666 "$DB_FILE"

echo "🚀 Iniciando aplicação..."

