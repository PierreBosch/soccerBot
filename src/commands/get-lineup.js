async function getLineup(message, client) {
  const sender = message.from;
  
  const imageUrl = 'https://i.ibb.co/3FZRssD/Escalac-a-o-13-08-24.png'
  
  if(imageUrl !== null) {
    await client.sendImage(sender, imageUrl)              
  } else {
    await client.sendText(sender, 'Calma calabreso! A escalação ainda está sendo montada.')
  }
}

module.exports = getLineup