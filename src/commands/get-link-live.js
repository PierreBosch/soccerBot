
async function getLinkLive(message, client) {
  const sender = message.from;
  
  await client.sendText(sender, "🎥 Câmera 01");
  await client.sendLinkPreview(sender, "https://youtube.com/live/9isAhvvDYsg?feature=share");
}

module.exports = getLinkLive
