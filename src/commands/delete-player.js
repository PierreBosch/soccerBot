const getPlayerName = require('../util/extract-first-and-last-name');
const deletePlayerService = require('../http/delete-player');
const getSoccerList = require('./get-soccer-list');
const funnyPhrasesOnLeave = require('../sentences/funny-on-leave');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const { isEmpty } = require('lodash');

async function deletePlayer(message, client, args = {}) {
  try {
    const guestName = message.body.split('|')[1] ?? args?.nome;
    const isGuest = !isEmpty(guestName);
    
    const playerName = isGuest ? guestName.trim() : message.sender.pushname;  
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