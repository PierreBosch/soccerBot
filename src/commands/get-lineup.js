async function getLineup(message, client) {
  const sender = message.from;

  const imageUrl = 'https://i.ibb.co/Dt4Sdbv/Escalacao-2.png'

  try {
    await client.sendImage(sender, imageUrl)
  } catch (error) {
    await client.sendText(sender, 'Calma calabreso! A escalação ainda está sendo montada.')
  }
}

module.exports = getLineup