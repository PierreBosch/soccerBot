const getPixTemplate = require('../templates/get-pix-template');

async function getPixKey(message, client) {
  const sender = message.from;
  
  const pixTemplate = getPixTemplate();
  
  await client.sendText(sender, pixTemplate);
}

module.exports = getPixKey