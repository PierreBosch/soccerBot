FROM node:22

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && apt-get install -y \
  curl gnupg ca-certificates fonts-liberation libxss1 libappindicator3-1 libatk-bridge2.0-0 libgtk-3-0 libx11-xcb1 libdrm2 libgbm1 libasound2 libnss3 libxshmfence1 libxcursor1 libxrandr2 libxcomposite1 libxdamage1 libatk1.0-0 libpango-1.0-0 libpangocairo-1.0-0 wget \
  && curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-signing-keyring.gpg \
  && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install pm2 -g

COPY . .

EXPOSE 3000 3001

CMD ["pm2-runtime", "ecosystem.config.js"]
