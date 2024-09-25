const api = require('../config/config-http');

async function addPlayer(name, isWaitingList = false) {
  await api.post('/players', { name, isWaitingList })
}

module.exports = addPlayer;


