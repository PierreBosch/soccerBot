"use strict";

const start = require('./commands')
const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');

// Função para aguardar o JSON Server estar pronto
async function waitForJSONServer() {
    const maxRetries = 30;
    let retries = 0;
    
    console.log('🔍 Aguardando JSON Server iniciar...');
    
    while (retries < maxRetries) {
        try {
            await axios.get('http://localhost:3001');
            console.log('✅ JSON Server conectado com sucesso!');
            return true;
        } catch (error) {
            retries++;
            if (retries % 5 === 0) {
                console.log(`⏳ Aguardando JSON Server... (${retries}/${maxRetries})`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    throw new Error('❌ JSON Server não iniciou a tempo! Verifique se o processo futebot-db está rodando.');
}

wppconnect
    .create({
    puppeteerOptions: {
        args: ['--no-sandbox','--disable-setuid-sandbox'],
    },
    session: 'sessionName',
    catchQR: (base64Qr, asciiQR) => {
        console.log(asciiQR); 
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');
        var imageBuffer = response;
        require('fs').writeFile('out.png', imageBuffer['data'], 'binary', function (err) {
            if (err != null) {
                console.log(err);
            }
        });
    },
    logQR: false,
})
    .then(async (client) => {
        // Aguardar JSON Server antes de iniciar os comandos
        await waitForJSONServer();
        return start(client);
    })
    .catch((error) => console.log(error));

