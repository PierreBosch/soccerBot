const api = require('../config/config-http');

async function getPlayers(onlyQueuePlayers = false) {
  const filter = onlyQueuePlayers ? '?isWaitingList=true' : '?isWaitingList=false';

  const response = await api.get(`/players${filter}`)

  return response.data
}

module.exports = getPlayers;



