FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Instala PM2 globalmente
RUN npm install -g pm2

COPY . .

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
FROM node:22-alpine

WORKDIR /app

# Dependências para sharp
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

COPY package*.json ./

RUN npm install --include=optional

COPY . .

RUN npm install -g pm2

# Criar diretórios
RUN mkdir -p /app/tokens /app/logs

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--log-date-format", "YYYY-MM-DD HH:mm:ss"]
