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
        
        const participantsTemplate = templateService.getTemplateBeachTennis(participants, list.rules);
        
        // Verificar as regras da lista
        const listRules = list.rules || {};
        let mensagemAdicional = "";
        
        // Adicionar informação sobre o limite de participantes, se aplicável
        if(listRules.hasMaxParticipants) {
          mensagemAdicional += `\n\n👥 *Limite de participantes:* ${listRules.maxParticipants}`;
        }
        
        // Adicionar informação sobre o valor a pagar, se aplicável
        if(listRules.hasPrice && listRules.price > 0) {
          mensagemAdicional += `\n💰 *Valor a pagar:* R$ ${listRules.price.toFixed(2)}`;
        }
        
        await client.sendText(groupId, `*${list.name}*\n\n${participantsTemplate.trim()}${mensagemAdicional}`)
      }
  } catch (error) {
      console.log(error)
  }
}

module.exports = getParticipantsList;



