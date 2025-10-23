FROM node:22

WORKDIR /usr/src/app

# Instalar dependências do sistema para Puppeteer (necessárias para WPPConnect)
RUN apt-get update && apt-get install -y \
    libxshmfence-dev libgbm-dev wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 \
    libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
    libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Instalar Google Chrome para Puppeteer
RUN wget -q -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y /tmp/chrome.deb && rm /tmp/chrome.deb

COPY package*.json ./
RUN npm install
RUN npm install pm2 -g

COPY . .

EXPOSE 3000 3001

CMD ["pm2-runtime", "ecosystem.config.js"]
