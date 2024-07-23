const api = require('../config/config-http');

async function getGoalKeepers() {
  const response = await api.get('/goalKeepers')

  return response.data
}

module.exports = getGoalKeepers;



