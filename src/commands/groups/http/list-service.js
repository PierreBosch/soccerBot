const api = require("../../../config/config-http");


async function create(name, groupId) {
  return await api.post('/lists', { name, groupId })
}

async function getListsByGroupId(listId) {
  return await api.get(`/lists?groupId=${listId}`)
}

module.exports = {
  create,
  getListsByGroupId
};


