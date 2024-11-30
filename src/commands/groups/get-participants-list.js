const listsService = require("./http/list-service");
const participantsService = require("./http/participant-service");
const templateService = require("./templates/get-template-beach");

async function getParticipantsList(message, client) {
  try {
      const groupId = message.from;

      const { data: lists } = await listsService.getListsByGroupId(groupId);

      if(lists.length > 0) {
        const list = lists[0];

        const { data: participants } = await participantsService.getParticipantsList(list.id)
        
        const participantsTemplate = templateService.getTemplateBeachTennis(participants);
        
        await client.sendText(groupId, `*${list.name}*\n\n${participantsTemplate.trim()}`)
      }
  } catch (error) {
      console.log(error)
  }
}

module.exports = getParticipantsList;



