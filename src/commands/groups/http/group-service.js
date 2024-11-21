const api = require("../../../config/config-http");


async function create(id, name) {
  return await api.post('/whatsappGroups', { id, name })
}

module.exports = {
  create
} ;


