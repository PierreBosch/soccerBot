"use strict";

const start = require('./commands')
const wppconnect = require('@wppconnect-team/wppconnect');

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
    .then((client) => start(client))
    .catch((error) => console.log(error));

