const getGoalKeepers = require("../http/get-goal-keepers");
const getPlayers = require("../http/get-players");
const isAdmin = require("../permissions");
const delay = require("../util/delay");

const template = `🍗⚽ *CONVITE ESPECIAL* ⚽🍗

Galera, bora pro *RISOTO DE FRANGO* pós jogo! 🔥

📅 *Quando:* Quarta-feira às 20h
⚽ *Onde:* Logo depois do jogo
🍚 *Cardápio:* Risoto de frango delicioso + boa conversa

---

*COMO CONFIRMAR (POR AQUI MESMO):*
✅ Só risoto: \`/add-churras\`
🥤 Risoto + bebida: \`/add-churras-coca\`

---

🎯 Vamos celebrar a vitória (ou esquecer a derrota) com muito sabor!

Confirma aí galera! 👊🍻

_Obs: Vagas limitadas, confirma logo!_ ⏰`

async function sendPlayersMessages(message, client) {
  const senderId = message.sender.id; 

  if(isAdmin(senderId)) {
    const players = await getPlayers();
    const goalKeepers = await getGoalKeepers();

    const guests = [...new Set([...players, ...goalKeepers])];

    for(const guest of guests) {
      await client.sendText(guest.phoneNumber, template);
      await delay(3000);
    }
  }
}

module.exports = sendPlayersMessages