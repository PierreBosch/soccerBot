FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Instala PM2 globalmente
RUN npm install -g pm2

COPY . .

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
