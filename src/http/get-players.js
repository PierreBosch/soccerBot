const api = require('../config/config-http');

async function getPlayers() {
  const response = await api.get('/players')

  return response.data
}

module.exports = getPlayers;



