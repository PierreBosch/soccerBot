const getBarbecuePriceTemplate = require('../templates/get-barbecue-price-template');

async function getBarbecuePrice(message, client) {
  const sender = message.from;

  const barbecuePriceTemplate = getBarbecuePriceTemplate();
  
  await client.sendText(sender, barbecuePriceTemplate);
}

module.exports = getBarbecuePrice