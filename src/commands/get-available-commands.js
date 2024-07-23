const getAvailableCommandsTemplate = require('../templates/get-available-commands-template');

async function getAvailableCommands(message, client) {
  const sender = message.from;
  
  const availableCommandsTemplate = getAvailableCommandsTemplate();
  
  await client.sendText(sender, availableCommandsTemplate);
}

module.exports = getAvailableCommands