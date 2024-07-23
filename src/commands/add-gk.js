const getGoalKeepers = require('../http/get-goal-keepers');
const addGoalKeeperService = require('../http/add-goal-keeper');
const getPlayerName = require('../util/extract-first-and-last-name');
const getSoccerListTemplate = require('../templates/get-soccer-list-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAdd = require('../sentences/funny-on-add-gk');

const soldOutExceptionAnswer = `A lista com 2 goleiros já está completa, não é possível adicionar`

async function addGoalKeeper(message, client) {
  try {
      const playerName = message.sender.pushname;
      const sender = message.from;
      
      const currentGoalKeepersList =  await getGoalKeepers();

      if(currentGoalKeepersList.length === 2) {
        return await client.sendText(sender, soldOutExceptionAnswer)
      }

      await addGoalKeeperService(getPlayerName(playerName))

      const firstName = getPlayerName(playerName, true);
      const funnyAnswer = getRandomFunSentence(funnyPhrasesOnAdd, firstName);

      const soccerListTemplate = await getSoccerListTemplate();

      await client.sendText(sender, soccerListTemplate);
      await client.sendText(sender, funnyAnswer);
        
  } catch (error) {
      console.log(error)
  }
}

module.exports = addGoalKeeper;



