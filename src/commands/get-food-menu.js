const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnFoodMenu = require('../sentences/funny-on-food-menu');
const getFoodMenuTemplate = require('../templates/get-food-menu-template');
const getPlayerName = require('../util/extract-first-and-last-name');

async function getFoodMenu(message, client) {
  const playerName = message.sender.pushname;
  const sender = message.from;

  await client.sendText(sender, getFoodMenuTemplate())
  const firstName = getPlayer(playerName, true);

  await client.sendText(sender, getRandomFunSentence(funnyPhrasesOnFoodMenu, firstName))
}

module.exports = getFoodMenu