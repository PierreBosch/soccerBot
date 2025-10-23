const api = require('../config/config-http');

async function getPlayers(onlyQueuePlayers = false, useFilter = true) {
  const filter = onlyQueuePlayers ? '?isWaitingList=true' : '?isWaitingList=false';

  const response = await api.get(`/players${useFilter ? filter : ''}`);

  return response.data
}

module.exports = getPlayers;



