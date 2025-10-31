"use strict";

/**
 * NOTA: Este arquivo agora é apenas um wrapper de compatibilidade.
 * O bot agora usa Evolution API via webhooks.
 * O servidor principal está em src/server.js
 * 
 * Para iniciar o bot, use: npm start (que agora executa src/server.js)
 */

const start = require('./commands');

module.exports = start;

