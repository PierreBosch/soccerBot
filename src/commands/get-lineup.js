async function getLineup(message, client) {
  const sender = message.from;
  
  const imageUrl = 'https://ibb.co/9bZ5rsP'
  
  await client.sendImage(sender, imageUrl)              
}

module.exports = getLineup