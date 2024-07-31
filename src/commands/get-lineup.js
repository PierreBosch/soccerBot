async function getLineup(message, client) {
  const sender = message.from;
  
  const imageUrl = 'https://i.ibb.co/nL25ZQd/Escalac-a-o-31-07-24-1.png'
  
  if(imageUrl !== null) {
    await client.sendImage(sender, imageUrl)              
  } else {
    await client.sendText(sender, 'Calma calabreso! A escalação ainda está sendo montada.')
  }
}

module.exports = getLineup