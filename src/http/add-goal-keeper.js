const api = require('../config/config-http');

async function addGoalKeeper(name) {
  await api.post('/goalKeepers', { name })
}

module.exports = addGoalKeeper