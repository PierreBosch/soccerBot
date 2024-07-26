const api = require('../config/config-http');

async function addCokeToBarbecueEater(id, stayForCoke) {
  await api.patch(`/barbecueEaters/${id}`, { stayForCoke })
}

module.exports = addCokeToBarbecueEater;


