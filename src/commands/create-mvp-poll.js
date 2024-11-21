
const getPlayers = require('../http/get-players');
const getGoalKeepers = require('../http/get-goal-keepers');

function splitArrayIntoChunks(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function createMVPPoll(message, client) {
  try {
    const sender = message.from;

    const players = await getPlayers();
    const playerNames = players.map((player) => player.name);
    const goalKeepers = await getGoalKeepers();
    const goalKeeperNames = goalKeepers.map((goalKeeper) => goalKeeper.name);
    const allPlayers = [...playerNames, ...goalKeeperNames]
    
    const playerChunks = splitArrayIntoChunks(allPlayers, 10);
  
    for (const players of playerChunks) {
      await client.sendPollMessage(sender, "Vote no MVP da partida", players, { selectableCount: 1 });
    }  
  } catch (error) {
    console.log(error)
  }
  
}

module.exports = createMVPPoll