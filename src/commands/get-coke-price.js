const getCokePriceTemplate = require('../templates/get-coke-price-template');

async function getCokePrice(message, client) {
  const sender = message.from;
  
  const cokePriceTemplate = getCokePriceTemplate();
  
  await client.sendText(sender, cokePriceTemplate);
}

module.exports = getCokePrice