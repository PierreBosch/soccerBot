
async function getLinkScoreControl(message, client) {
  const sender = message.from;

  await client.sendText(sender, "https://app.overlays.uno/control/3bqdDm3kk3TcnTyFtIludl");
}

module.exports = getLinkScoreControl