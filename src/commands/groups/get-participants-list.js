const listsService = require("./http/lists-service");
const participantsService = require("./http/participants-service");

function gerarListaNumerada(array) {
  const limite = 10;
  const lista = [];

  for (let i = 0; i < limite; i++) {
    const numero = i + 1;
    const nome = array[i]?.name || ""; // Verifica se existe um nome no índice, caso contrário deixa vazio
    lista.push(`${numero}. ${nome}`.trim()); // Remove qualquer espaço desnecessário
  }

  return lista.join("\n"); // Junta cada item em uma linha separada
}

async function getParticipantsList(message, client) {
  try {
      const groupId = message.from;

      const { data: lists } = await listsService.getListsByGroupId(groupId);

      if(lists.length > 0) {
        const list = lists[0];

        const { data: participants } = await participantsService.getParticipantList(list.id)
        
        const participantsTemplate = gerarListaNumerada(participants);
        
        await client.sendText(groupId, `*Lista ${list.name}*\n\n*Participantes*\n\n${participantsTemplate.trim()}`)
      }
  } catch (error) {
      console.log(error)
  }
}

module.exports = getParticipantsList;



