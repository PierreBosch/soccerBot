const api = require('../config/config-http');

async function getDebtorsList() {
  const response = await api.get('/debtors')

  return response.data
}

module.exports = getDebtorsList;



