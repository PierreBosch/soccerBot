const getSoccerListTemplate = require('../templates/get-soccer-list-template');

async function getSoccerList(message, client) {
  const sender = message.from;

  
  const soccerListTemplate = await getSoccerListTemplate()
  await client.sendText(sender, soccerListTemplate.trim())
}

module.exports = getSoccerList;