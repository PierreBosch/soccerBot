const getPlayersTemplate = require('../templates/get-players-template');
const getGoalKeepersTemplate = require('../templates/get-goal-keepers-template');

const getPlayers = require('../http/get-players');
const getGoalKeepers = require('../http/get-goal-keepers');
const getWaitingListTemplate = require('./get-waiting-list-template');

async function getSoccerListTemplate() {

  const players = await getPlayers();
  const goalKeepers = await getGoalKeepers();
  const onlyQueuePlayers = await getPlayers(true);
  const onlyQueueGoalKeepers = await getGoalKeepers(true);
  const queuePlayers = getWaitingListTemplate(onlyQueuePlayers)
  const queueGoalKeepers = getWaitingListTemplate(onlyQueueGoalKeepers, true)

  const queueHasPlayers = Boolean(queuePlayers) || Boolean(queueGoalKeepers)
  const queuePlayersExist = Boolean(queuePlayers)
  const queueGoalKeepersExist = Boolean(goalKeepers)

  return `📢 *Avisos*

⚽ Futebol Quarta-feira⏱19h00
🏟 Arena: Andrino Campo 3

*Fique atento ao horário novo*

*18h30 começa o aquecimento*
    
🚨 Evite desistências
🚨 6 na linha 1 no Gol e 2 reservas
    
*Jogadores*

${getPlayersTemplate(players).trim()}

*Goleiros*

${getGoalKeepersTemplate(goalKeepers).trim()}
${queueHasPlayers && `
*Lista de Espera*
`}
${queuePlayersExist && `
*Linha*
${queuePlayers.trim()}`}
${queueGoalKeepersExist && `
*Goleiros*
${queueGoalKeepers.trim()}`}`.trim()
}

module.exports = getSoccerListTemplate