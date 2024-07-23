
const getPlayerName = require('../util/extract-first-and-last-name');
const getBarbecueEatersTemplate = require('../templates/get-barbecue-eaters-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAddBarbecue = require('../sentences/funny-on-add-barbecue');
const addBarbecueEaterService = require('../http/add-to-barbecue');

const ADMIN_WHATSAPP_ID = "554896742125@c.us"

async function addBarbecueEater(message, client) {
  try {
      const senderId = message.sender.id;
      const playerName = message.sender.pushname;
      const sender = message.from;

      const [,,addCoke] = message.body.split('-') 
      const stayForCoke = !!addCoke 

      const [,barbecueEaterGuest] = message.body.split("|")

      if(senderId  === ADMIN_WHATSAPP_ID && !!barbecueEaterGuest) {
        await addBarbecueEaterService(getPlayerName(barbecueEaterGuest), stayForCoke)
      }else {
        await addBarbecueEaterService(getPlayerName(playerName), stayForCoke)
      }        

      const firstName = getPlayerName(barbecueEaterGuest ? barbecueEaterGuest : playerName, true);
      const funnyAnswer = getRandomFunSentence(funnyPhrasesOnAddBarbecue, firstName);

      const barbecueEatersTemplate = await getBarbecueEatersTemplate();

      await client.sendText(sender, barbecueEatersTemplate);
      await client.sendText(sender, funnyAnswer);
  } catch (error) {
      console.log(error)
  }
}

module.exports = addBarbecueEater;



