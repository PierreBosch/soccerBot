const getPlayers = require('../http/get-players');
const addPlayerService = require('../http/add-player');
const getPlayerName = require('../util/extract-first-and-last-name');
const getSoccerListTemplate = require('../templates/get-soccer-list-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAdd = require('../sentences/funny-on-add');

const soldOutExceptionAnswer = 'A lista com 16 jogadores já está completa, você foi colocado na lista de espera'
const playerAlreadyExistsException = 'Você já está na lista do futebol, seu nome não pode ser adicionado mais de uma vez'

async function addPlayer(message, client) {
  try {
      const playerName = message.sender.pushname;  
      const sender = message.from;

      const currentPlayersList =  await getPlayers();
      
      const playerNameExists = currentPlayersList.find(player => player.name === getPlayerName(playerName))

      if(playerNameExists) {
        return await client.sendText(sender, playerAlreadyExistsException)
      }

      if(currentPlayersList.length === 16) {
        const isWaitingList= true;
        
        await addPlayerService(getPlayerName(playerName), isWaitingList)
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



