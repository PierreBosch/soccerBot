const getPlayersTemplate = require('../templates/get-players-template');
const getGoalKeepersTemplate = require('../templates/get-goal-keepers-template');

const getPlayers = require('../http/get-players');
const getGoalKeepers = require('../http/get-goal-keepers');
const getWaitingListTemplate = require('./get-waiting-list-template');

async function getSoccerListTemplate() {

  const players = await getPlayers();
  const goalKeepers = await getGoalKeepers();

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
${getWaitingListTemplate(players) || getWaitingListTemplate(goalKeepers) && `
*Lista de Espera*
`}
${getWaitingListTemplate(players) && `
*Linha*
${getWaitingListTemplate(players)}
`}
${getWaitingListTemplate(goalKeepers) &&`
*Goleiros*
${getWaitingListTemplate(goalKeepers)}
`}
`
}

module.exports = getSoccerListTemplate