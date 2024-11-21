const api = require("../../../config/config-http");

async function getParticipantList(listId) {
  return await api.get(`/participants?listId=${listId}`)
}

module.exports = {
  getParticipantList
};
