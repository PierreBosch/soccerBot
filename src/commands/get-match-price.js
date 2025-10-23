const getMatchPriceTemplate = require('../templates/get-match-price-template');

async function getMatchPrice(message, client) {
  const sender = message.from;
  console.log(sender);
  
  const matchPriceTemplate = getMatchPriceTemplate();
  
  await client.sendText(sender, matchPriceTemplate);
}

module.exports = getMatchPrice