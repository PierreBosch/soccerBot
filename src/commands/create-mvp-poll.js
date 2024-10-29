
const getPlayers = require('../http/get-players');
const getGoalKeepers = require('../http/get-goal-keepers');

async function createMVPPoll(message, client) {
  try {
    const sender = message.from;

    const players = await getPlayers();
    const playerNames = players.map((player) => player.name);
    const goalKeepers = await getGoalKeepers();
    const goalKeeperNames = goalKeepers.map((goalKeeper) => goalKeeper.name);
    console.log([...playerNames, ...goalKeeperNames])
    await client.sendPollMessage(sender, "Vote no MVP da partida", [...playerNames, ...goalKeeperNames], { selectableCount: 1 })
  } catch (error) {
    console.log(error)
  }
  
}

module.exports = createMVPPoll