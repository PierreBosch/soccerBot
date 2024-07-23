const api = require('../config/config-http');

async function addPlayer(name) {
  await api.post('/players', { name })
}

module.exports = addPlayer;


