
const getPlayerName = require('../util/extract-first-and-last-name');
const getBarbecueEatersTemplate = require('../templates/get-barbecue-eaters-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAddBarbecue = require('../sentences/funny-on-add-barbecue');
const addBarbecueEaterService = require('../http/add-to-barbecue');

async function addBarbecueEater(message, client) {
  try {
      const playerName = message.sender.pushname;
      const sender = message.from;

      const [,,addCoke] = message.body.split('-') 
      const stayForCoke = !!addCoke

      await addBarbecueEaterService(getPlayerName(playerName), stayForCoke)

      const firstName = getPlayerName(playerName, true);
      const funnyAnswer = getRandomFunSentence(funnyPhrasesOnAddBarbecue, firstName);

      const barbecueEatersTemplate = await getBarbecueEatersTemplate();

      await client.sendText(sender, barbecueEatersTemplate);
      await client.sendText(sender, funnyAnswer);
        
  } catch (error) {
      console.log(error)
  }
}

module.exports = addBarbecueEater;



