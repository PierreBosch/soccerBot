const api = require('../config/config-http');

async function addGoalKeeper(name, isWaitingList = false) {
  await api.post('/goalKeepers', { name, isWaitingList })
}

module.exports = addGoalKeeper