async function getLineup(message, client) {
  const sender = message.from;
  
  const imageUrl = 'https://i.ibb.co/StfC3RS/DOIS-TIMES-NO-MESMO-CAMPO-5.png'
  
  await client.sendImage(sender, imageUrl)              
}

module.exports = getLineup