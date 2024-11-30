const api = require("../../../config/config-http");


async function create(id, name) {
  return await api.post('/whatsappGroups', { id, name })
}

async function findGroupById(id) {
  const { data } = await api.get(`/whatsappGroups?id=${id}`)

  return data.length > 0 ? data[0] : null;
}

module.exports = {
  create,
  findGroupById
} ;


