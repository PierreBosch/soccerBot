const isEmpty = require("lodash/isEmpty");
const groupService = require("./http/group-service");
const listService = require("./http/list-service");
const participantService = require("./http/participant-service");
const templateService = require("./templates/get-template-beach");

async function deleteParticipantList(message, client) {
  try {
      const groupId = message.from;
      const groupExists = await groupService.findGroupById(groupId);

      if(!!groupExists) {
        const playerPhoneNumber = message.sender.id;
        const { data: lists } = await listService.getListsByGroupId(groupId);
       
        if(lists.length > 0){
          const listId = lists[0].id;
          const listName = lists[0].name;

          const { data: currentParticipants } = await participantService.getParticipantsList(listId)
          const participant = currentParticipants.find(participant => participant.phoneNumber === playerPhoneNumber);

          if(isEmpty(participant)) {
            return await client.sendText(groupId, `Opa, opa! Você não estava na lista`);
          }
          
          await participantService.removeParticipant(participant.id)
        
          const { data: participants } = await participantService.getParticipantsList(listId)
          const participantsTemplate = templateService.getTemplateBeachTennis(participants);

          await client.sendText(groupId, `*${listName}*\n\n${participantsTemplate.trim()}`)
        }
      }
  } catch (error) {
      console.log(error)
  }
}

module.exports = deleteParticipantList;



