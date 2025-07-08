const getGoalKeepers = require("../http/get-goal-keepers");
const getPlayers = require("../http/get-players");
const isAdmin = require("../permissions");
const delay = require("../util/delay");

async function createInviteBarbecue(message, client) {
  const senderId = message.sender.id; 

  if(isAdmin(senderId)) {
    const players = await getPlayers();
    const goalKeepers = await getGoalKeepers();

    const guests = [...new Set([...players, ...goalKeepers])];

    for(const guest of guests) {
      await client.sendListMessage(guest.phoneNumber, {
        buttonText: 'Clique para responder',
        description: `E aí, galera! ⚽ \n\nDepois do jogo, vai rolar um *Churrasco top* às *20h*! 🔥 \n\n*Cardápio*: Churrasco 🥩, (Pão d'agua, linguiça e farofa) \n\n*Valor*: Só R$ 20,00 por pessoa 💸 \n\nConfirma aí se vem, vai ser demais! 🎉`,
        sections: [
          {
            title: 'Ficar pro Churrasco',
            rows: [
              {
                rowId: 'add-churras-coca',
                title: 'Bora! Pode me adicionar e coloca a coca junto 🥩🥤',
              },
              {
                rowId: 'add-churras',
                title: 'Bora! Pode me adicionar, só Churrasco 🥩',
              },
              {
                rowId: 'sem-churras',
                title: 'Não vou participar',
              },
            ],
          },
        ],
      });
      await delay(3000);
    }
  }
}

module.exports = createInviteBarbecue