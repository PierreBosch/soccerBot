const api = require('../config/config-http');

const getPlayers = require('../http/get-players');
const getGoalKeepers = require('../http/get-goal-keepers');

async function deleteSoccerList() {
  const players = await getPlayers()
  const goalKeepers = await getGoalKeepers()

  const playerIds = players.map(player => player.id)
  const goalKeeperIds = goalKeepers.map(player => player.id)
  
  playerIds.forEach(async (id) => api.delete(`/players/${id}`))
  goalKeeperIds.forEach(async (id) => api.delete(`/goalKeepers/${id}`))
}

module.exports = deleteSoccerList