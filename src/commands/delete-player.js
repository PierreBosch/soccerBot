const getPlayerName = require('../util/extract-first-and-last-name');
const deletePlayerService = require('../http/delete-player');
const getSoccerList = require('./get-soccer-list');
const funnyPhrasesOnLeave = require('../sentences/funny-on-leave');
const getRandomFunSentence = require('../util/get-random-fun-sentence');

async function deletePlayer(message, client) {
  try {
    const playerName = message.sender.pushname;
    const sender = message.from;

    await deletePlayerService(getPlayerName(playerName));
    await getSoccerList(message,client);

    const firstName = getPlayerName(playerName, true);
    await client.sendText(sender, getRandomFunSentence(funnyPhrasesOnLeave, firstName))
   
  } catch (error) {
      console.log(error)
  }
}

module.exports = deletePlayer