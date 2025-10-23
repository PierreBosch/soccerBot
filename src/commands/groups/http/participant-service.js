const api = require("../../../config/config-http");

async function getParticipantsList(listId) {
  return await api.get(`/participants?listId=${listId}`)
}

async function addParticipantList(name, phoneNumber, listId) {
  const participant = {
    name,
    phoneNumber,
    listId,
  }

  return await api.post(`/participants`, participant)
}

async function removeParticipant(participantId) {
  return await api.delete(`/participants/${participantId}`)
}

module.exports = {
  getParticipantsList,
  addParticipantList,
  removeParticipant
};
