async function getLineup(message, client) {
  const sender = message.from;

  const imageUrl = 'https://i.ibb.co/tYsc9dK/Escalacao-3.png'

  try {
    await client.sendImage(sender, imageUrl)
  } catch (error) {
    await client.sendText(sender, 'Calma calabreso! A escalação ainda está sendo montada.')
  }
}

module.exports = getLineup