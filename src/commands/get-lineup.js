async function getLineup(message, client) {
  const sender = message.from;

  const imageUrl = 'https://i.ibb.co/8b7tKk3/escalacao-11-09.png'

  if (imageUrl !== null) {
    await client.sendImage(sender, imageUrl)
  } else {
    await client.sendText(sender, 'Calma calabreso! A escalação ainda está sendo montada.')
  }
}

module.exports = getLineup