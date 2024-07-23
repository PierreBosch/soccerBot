const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnFoodMenu = require('../sentences/funny-on-food-menu');
const getFoodMenuTemplate = require('../templates/get-food-menu-template');

async function getFoodMenu(message, client) {
  const sender = message.from;

  await client.sendText(sender, getFoodMenuTemplate())
  await client.sendText(sender, getRandomFunSentence(funnyPhrasesOnFoodMenu))
}

module.exports = getFoodMenu