const getPlayersTemplate = require('../templates/get-players-template');
const getGoalKeepersTemplate = require('../templates/get-goal-keepers-template');

const getPlayers = require('../http/get-players');
const getGoalKeepers = require('../http/get-goal-keepers');
const getWaitingListTemplate = require('./get-waiting-list-template');
const { isEmpty } = require('lodash');

async function getSoccerListTemplate() {

  const players = await getPlayers();
  const goalKeepers = await getGoalKeepers();

  const onlyQueuePlayers = await getPlayers(true);
  const onlyQueueGoalKeepers = await getGoalKeepers(true);

  const queuePlayersTemplate = getWaitingListTemplate(onlyQueuePlayers)
  const queueGoalKeepersTemplate = getWaitingListTemplate(onlyQueueGoalKeepers, true)
  
  const queuePlayersExist = !isEmpty(onlyQueuePlayers)
  const queueGoalKeepersExist = !isEmpty(onlyQueueGoalKeepers)
  const queueHasPlayers = queuePlayersExist || queueGoalKeepersExist

  return `⚽ *Futebol dos Brothers*

🚨 *Evite desistências*
💰 *Pagamento antecipado*

🗓️ *Dia da semana:* Quarta feira
⏰ *Horário:* 19h00
🏟 *Arena:* Andrino Campo 3

*🤖 Comandos*

*Linha*
_Digite_ \`/add\` _para participar_

*Goleiro*
_Digite_ \`/goleiro\` _para participar_

*Desistir*
_Digite_ \`/fora\` _para sair da lista_

*Jogadores*

${getPlayersTemplate(players).trim()}

*Goleiros*

${getGoalKeepersTemplate(goalKeepers).trim()}

${queueHasPlayers ? '*Lista de Espera* \n' : ''}
${queuePlayersExist ? queuePlayersTemplate.trim() : ''}
${queueGoalKeepersExist ? queueGoalKeepersTemplate.trim() : ''}
`.trim()
}

module.exports = getSoccerListTemplate