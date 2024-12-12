const api = require('../config/config-http');

async function addPlayer({ name, phoneNumber }, isWaitingList = false) {
  await api.post('/players', { name, phoneNumber, isWaitingList })
}

module.exports = addPlayer;


