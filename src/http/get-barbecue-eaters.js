const api = require('../config/config-http');

async function getBarbecueEaters() {
  const response = await api.get('/barbecueEaters')

  return response.data
}

module.exports = getBarbecueEaters;



