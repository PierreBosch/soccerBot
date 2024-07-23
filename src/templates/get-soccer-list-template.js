const getPlayersTemplate = require('../templates/get-players-template');
const getGoalKeepersTemplate = require('../templates/get-goal-keepers-template');

const getPlayers = require('../http/get-players');
const getGoalKeepers = require('../http/get-goal-keepers');

async function getSoccerListTemplate() {

  const players = await getPlayers();
  const goalKeepers = await getGoalKeepers();

  return `📢 *Avisos*

⚽ Futebol Quarta-feira⏱19h30
🏟 Estádio: Santiago Bernandrino
    
🚨 Evite desistências
🚨 6 na linha 1 no Gol e 2 reservas
    
*Jogadores*

${getPlayersTemplate(players).trim()}

*Goleiros*

${getGoalKeepersTemplate(goalKeepers).trim()}`
}

module.exports = getSoccerListTemplate