const api = require("../../../config/config-http");


async function create(name, groupId, rules = null) {
  const defaultRules = {
    maxParticipants: 6,
    hasMaxParticipants: true,
    price: 0,
    hasPrice: false
  };
  
  const listRules = rules || defaultRules;
  
  return await api.post('/lists', { 
    name, 
    groupId,
    rules: listRules
  })
}

async function getListsByGroupId(listId) {
  return await api.get(`/lists?groupId=${listId}`)
}

module.exports = {
  create,
  getListsByGroupId
};


