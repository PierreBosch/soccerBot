const api = require('../config/config-http');

async function getGoalKeepers(onlyQueuePlayers = false) {
  const filter = onlyQueuePlayers ? '?isWaitingList=true' : '?isWaitingList=false';

  const response = await api.get(`/goalKeepers${filter}`)

  return response.data
}

module.exports = getGoalKeepers;



