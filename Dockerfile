FROM node:22

# Não precisa mais do Chrome/Puppeteer pois usamos Evolution API
# Não precisa mais do PM2 pois usamos Docker Compose para orquestração

WORKDIR /usr/src/app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta do servidor Express
EXPOSE 3000

# Executar servidor diretamente com Node
CMD ["node", "src/server.js"]
