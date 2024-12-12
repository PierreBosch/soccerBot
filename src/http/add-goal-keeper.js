const api = require('../config/config-http');

async function addGoalKeeper({ name, phoneNumber }, isWaitingList = false) {
  await api.post('/goalKeepers', { name, phoneNumber, isWaitingList })
}

module.exports = addGoalKeeper