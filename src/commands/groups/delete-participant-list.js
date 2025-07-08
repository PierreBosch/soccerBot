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
          
          // Verificar as regras da lista
          const listRules = lists[0].rules || {};
          const participantsTemplate = templateService.getTemplateBeachTennis(participants, listRules);
          
          // Preparar mensagem adicional com as regras
          let mensagemAdicional = "";
          
          // Adicionar informação sobre o valor a pagar, se aplicável
          if(listRules.hasPrice && listRules.price > 0) {
            mensagemAdicional += `\n\n💰 *Valor a pagar:* R$ ${listRules.price.toFixed(2)}`;
          }
          
          await client.sendText(groupId, `*${listName}*\n\n${participantsTemplate.trim()}${mensagemAdicional}`)
        }
      }
  } catch (error) {
      console.log(error)
  }
}

module.exports = deleteParticipantList;



