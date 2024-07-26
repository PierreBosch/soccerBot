
const getPlayerName = require('../util/extract-first-and-last-name');
const getBarbecueEatersTemplate = require('../templates/get-barbecue-eaters-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAddBarbecue = require('../sentences/funny-on-add-barbecue');
const addBarbecueEaterService = require('../http/add-to-barbecue');
const isAdmin = require('../permissions');
const getBarbecueEaters = require('../http/get-barbecue-eaters');

const barbecueEaterAlreadyExistsException = "Você já está na lista do churrasco, seu nome não pode ser adicionado mais de uma vez"

async function addBarbecueEater(message, client) {
  try {
      const senderId = message.sender.id;
      const playerName = message.sender.pushname;
      const sender = message.from;

      const [,,addCoke] = message.body.split('-') 
      const stayForCoke = !!addCoke 

      const [,barbecueEaterGuest] = message.body.split("|")

      const barbecueEaters = await getBarbecueEaters();

      const barbecueEaterExists = barbecueEaters.find(barbecueEater => barbecueEater.name === playerName || barbecueEater.name === barbecueEaterGuest)

      if(barbecueEaterExists) {
        return await client.sendText(sender, barbecueEaterAlreadyExistsException)
      }

      if(isAdmin(senderId) && !!barbecueEaterGuest) {
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



