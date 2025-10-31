const isEmpty = require("lodash/isEmpty");
const groupService = require("./http/group-service");
const listService = require("./http/list-service");
const participantService = require("./http/participant-service");
const templateService = require("./templates/get-template-beach");

async function addParticipantList(message, client) {
  try {
      const groupId = message.from;
      const groupExists = await groupService.findGroupById(groupId);

      if(!groupExists) {
        return await client.sendText(groupId,
          `⚠️ *Grupo não configurado!*\n\nUse o comando */configurar* para configurar este grupo primeiro.`);
      }

      const playerName = message.sender.pushname;
      const playerPhoneNumber = message.sender.id;
      const { data: lists } = await listService.getListsByGroupId(groupId);

      if(lists.length === 0) {
        return await client.sendText(groupId,
          `⚠️ *Nenhuma lista encontrada para este grupo.*\n\nUse o comando */configurar* para criar uma lista.`);
      }

      const listId = lists[0].id;
      const listName = lists[0].name;

      const { data: currentParticipants } = await participantService.getParticipantsList(listId)
      const participantExists = currentParticipants.find(participant => participant.phoneNumber === playerPhoneNumber);

      if(!isEmpty(participantExists)) {
        return await client.sendText(groupId, `Opa! Opa! Calma lá, seu nome já está na lista`);
      }

      // Verificar as regras da lista
      const listRules = lists[0].rules || {};

      // Verificar se a lista tem limite de participantes
      if(listRules.hasMaxParticipants && currentParticipants.length >= listRules.maxParticipants) {
        return await client.sendText(groupId, `Desculpe, a lista já está cheia! Máximo de ${listRules.maxParticipants} participantes atingido.`);
      }

      // Informar sobre o valor a pagar, se aplicável
      let paymentMessage = "";
      if(listRules.hasPrice && listRules.price > 0) {
        paymentMessage = `\n\n💰 *Valor a pagar:* R$ ${listRules.price.toFixed(2)}`;
      }

      await participantService.addParticipantList(playerName, playerPhoneNumber, listId)

      const { data: participants } = await participantService.getParticipantsList(listId)
      const participantsTemplate = templateService.getTemplateBeachTennis(participants, listRules);

      await client.sendText(groupId, `*${listName}*\n\n${participantsTemplate.trim()}${paymentMessage}`)
  }
  } catch (error) {
      console.log(error)
  }
}

module.exports = addParticipantList;



