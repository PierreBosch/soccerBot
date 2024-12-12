const getGoalKeepers = require('../http/get-goal-keepers');
const addGoalKeeperService = require('../http/add-goal-keeper');
const getPlayerName = require('../util/extract-first-and-last-name');
const getSoccerListTemplate = require('../templates/get-soccer-list-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAdd = require('../sentences/funny-on-add-gk');
const isEmpty = require('lodash/isEmpty');

const soldOutExceptionAnswer = 'A lista com 2 goleiros já está completa, você foi colocado na lista de espera'

async function addGoalKeeper(message, client) {
  try {
      const guestName = message.body.split('|')[1];
      const isGuest = !isEmpty(guestName);

      const playerName = isGuest ? guestName.trim() : message.sender.pushname;  
      const sender = message.from;
      const playerPhoneNumber = !isGuest ?  message.sender.id : null;
      
      const currentGoalKeepersList =  await getGoalKeepers();

      if(currentGoalKeepersList.length === 2) {
        await addGoalKeeperService({ name: getPlayerName(playerName), phoneNumber: playerPhoneNumber }, true)
        return await client.sendText(sender, soldOutExceptionAnswer)
      }

      await addGoalKeeperService({ name: getPlayerName(playerName), phoneNumber: playerPhoneNumber })
      
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



