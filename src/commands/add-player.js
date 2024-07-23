const getPlayers = require('../http/get-players');
const addPlayerService = require('../http/add-player');
const getPlayerName = require('../util/extract-first-and-last-name');
const getSoccerListTemplate = require('../templates/get-soccer-list-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAdd = require('../sentences/funny-on-add');

const soldOutExceptionAnswer = `A lista com 16 jogadores já está completa, não é possível adicionar`

async function addPlayer(message, client) {
  try {
      const playerName = message.sender.pushname;
      const sender = message.from;

      const currentPlayersList =  await getPlayers();

      if(currentPlayersList.length === 16) {
        return await client.sendText(sender, soldOutExceptionAnswer)
      }

      await addPlayerService(getPlayerName(playerName))

      const firstName = getPlayerName(playerName, true);
      const funnyAnswer = getRandomFunSentence(funnyPhrasesOnAdd, firstName);

      const soccerListTemplate = await getSoccerListTemplate();

      await client.sendText(sender, soccerListTemplate);
      await client.sendText(sender, funnyAnswer);
        
  } catch (error) {
      console.log(error)
  }
}

module.exports = addPlayer;



