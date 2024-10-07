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

${queueHasPlayers && '*Lista de Espera*'}

${queuePlayersExist && queuePlayersTemplate.trim()}
${queueGoalKeepersExist && queueGoalKeepersTemplate.trim()}
`
}

module.exports = getSoccerListTemplate