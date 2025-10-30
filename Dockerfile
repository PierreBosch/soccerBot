FROM node:22

# Não precisa mais do Chrome/Puppeteer pois usamos Evolution API
# RUN apt-get update && apt-get install -y ...

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install pm2 -g

COPY . .

EXPOSE 3000 3001

CMD ["pm2-runtime", "ecosystem.config.js"]
