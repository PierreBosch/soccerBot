async function getLineup(message, client) {
  const sender = message.from;
  
  const imageUrl = 'https://i.ibb.co/bHB9Lsw/Escalac-a-o-21-08-24.png'
  
  if(imageUrl !== null) {
    await client.sendImage(sender, imageUrl)              
  } else {
    await client.sendText(sender, 'Calma calabreso! A escalação ainda está sendo montada.')
  }
}

module.exports = getLineup