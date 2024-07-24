const clearDebtService = require('../http/clear-debt');
const isAdmin = require('../permissions');
const getPlayerName = require('../util/extract-first-and-last-name');
const getDebtorsList = require('./get-debtors-list');

async function clearDebt(message, client) {
  const sender = message.from;
  const playerName = getPlayerName(message.sender.pushname)

  try {
    const [,debtorName] = message.body.split("|")
   
    if(!!debtorName && isAdmin(sender)) {
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