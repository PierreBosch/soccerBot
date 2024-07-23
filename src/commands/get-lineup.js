async function getLineup(message, client) {
  const sender = message.from;
  
  const imageUrl = 'https://i.ibb.co/6tDwm7G/DOIS-TIMES-NO-MESMO-CAMPO-3.png'
  
  await client.sendImage(sender, imageUrl)              
}

module.exports = getLineup