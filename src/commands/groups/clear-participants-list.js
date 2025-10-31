const isEmpty = require("lodash/isEmpty");
const groupService = require("./http/group-service");
const listService = require("./http/list-service");
const participantService = require("./http/participant-service");
const templateService = require("./templates/get-template-beach");

async function clearParticipantsList(message, client) {
  try {
      const groupId = message.from;
      const groupExists = await groupService.findGroupById(groupId);

      if(!groupExists) {
        return await client.sendText(groupId,
          `⚠️ *Grupo não configurado!*\n\nUse o comando */configurar* para configurar este grupo primeiro.`);
      }

      const { data: lists } = await listService.getListsByGroupId(groupId);

      if(lists.length === 0) {
        return await client.sendText(groupId,
          `⚠️ *Nenhuma lista encontrada para este grupo.*\n\nUse o comando */configurar* para criar uma lista.`);
      }

      const listId = lists[0].id;
      const listName = lists[0].name;

      const { data: currentParticipants } = await participantService.getParticipantsList(listId);

      if(isEmpty(currentParticipants)) {
        return await client.sendText(groupId, `A lista já está vazia!`);
      }

      // Remover todos os participantes
      const removalPromises = currentParticipants.map(participant =>
        participantService.removeParticipant(participant.id)
      );

      await Promise.all(removalPromises);

      // Verificar as regras da lista
      const listRules = lists[0].rules || {};

      // Obter a lista vazia para exibir
      const { data: emptyParticipants } = await participantService.getParticipantsList(listId);
      const participantsTemplate = templateService.getTemplateBeachTennis(emptyParticipants, listRules);

      await client.sendText(groupId, `✅ Lista limpa com sucesso!\n\n*${listName}*\n\n${participantsTemplate.trim()}`);
  }
  } catch (error) {
      console.log(error);
      await client.sendText(message.from, `❌ Ocorreu um erro ao limpar a lista.`);
  }
}

module.exports = clearParticipantsList;