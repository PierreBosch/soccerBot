const api = require('../config/config-http');

async function addBarbecueEater(name, stayForCoke = false) {
  await api.post('/barbecueEaters', { name, stayForCoke })
}

module.exports = addBarbecueEater;


