const setScoreHttp = require('../http/set-score');

async function setScore(message, client) {
  const sender = message.from;
  console.log(`Comando /placar recebido de ${sender}`);
  await setScoreHttp(message.body.split(" ")[1]);
  await client.sendText(sender, "Placar atualizado com sucesso!");
}

module.exports = setScore;