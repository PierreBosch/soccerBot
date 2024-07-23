const api = require('../config/config-http');

async function getBillingPhones() {
  const response = await api.get('/billingPhones')

  return response.data
}

module.exports = getBillingPhones;



