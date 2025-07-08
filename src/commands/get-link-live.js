
async function getLinkLive(message, client) {
  const sender = message.from;
  
  await client.sendText(sender, "🎥 Câmera 01");
  await client.sendLinkPreview(sender, "https://www.youtube.com/watch?v=Nqi0GZLftJU");
  await client.sendText(sender, "🎥 Câmera 02");
  await client.sendText(sender, "https://www.youtube.com/watch?v=QnRtroRK6qs");
}

module.exports = getLinkLive
