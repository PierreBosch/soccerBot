async function getLineup(message, client) {
  const sender = message.from;
  
  const imageUrl = 'https://i.ibb.co/DDc0fSw/DOIS-TIMES-NO-MESMO-CAMPO-4.png'
  
  await client.sendImage(sender, imageUrl)              
}

module.exports = getLineup