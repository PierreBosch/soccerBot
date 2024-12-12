const clearDebtService = require('../http/clear-debt');
const isAdmin = require('../permissions');
const getPlayerName = require('../util/extract-first-and-last-name');
const createDebtorsList = require('./create-debtors-list');
const getDebtorsList = require('./get-debtors-list');

async function clearDebt(message, client) {
  const senderId = message.sender.id;
  const sender = message.from;
  const playerName = getPlayerName(message.sender.pushname)

  try {
    const [,debtorName] = message.body.split("|")

    const byPassAdmin = true;
    await createDebtorsList(message, client, byPassAdmin);
   
    if(!!debtorName && isAdmin(senderId)) {
      await clearDebtService(debtorName, true)
    } else {
      await clearDebtService(playerName)
    }
   
    await getDebtorsList(message,client, true);
  } catch (error) {
    await client.sendText(sender, error.message)
  }
}

module.exports = clearDebt