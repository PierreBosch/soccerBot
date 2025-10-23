const getPlayers = require('../http/get-players');
const getBarbecueEaters = require('../http/get-barbecue-eaters');
const createDebtorsService = require('../http/create-debtors-list');
const isAdmin = require('../permissions');
const getDebtorsList = require('./get-debtors-list');

async function createDebtorsList(message, client, byPassAdmin = false) {
  const sender = message.from;
  const senderId = message.sender.id;

  if(!isAdmin(senderId) && !byPassAdmin) {
    return await client.sendText(sender, 'Somente admins podem criar a lista de pagantes')
  }

  const players = await getPlayers();
  const barbecueEaters = await getBarbecueEaters();

  const playerNames = players.map(player => player.name)
  const barbecueEaterNames = barbecueEaters.map(barbecueEater => barbecueEater.name)

  const debtorsList = [...new Set([...playerNames, ...barbecueEaterNames])];

  await createDebtorsService(debtorsList)

  if(!byPassAdmin) {
    await getDebtorsList(message,client, true)
  }
}

module.exports = createDebtorsList