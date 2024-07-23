const getBarbecueEatersTemplate = require('../templates/get-barbecue-eaters-template');

async function getBarbecueEaters(message, client) {
  const sender = message.from;
  
  const barbecueEatersTemplate = await getBarbecueEatersTemplate()
  await client.sendText(sender, barbecueEatersTemplate.trim())
}

module.exports = getBarbecueEaters;