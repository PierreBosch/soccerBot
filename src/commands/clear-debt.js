const clearDebtService = require('../http/clear-debt');
const isAdmin = require('../permissions');
const getPlayerName = require('../util/extract-first-and-last-name');
const getDebtorsList = require('./get-debtors-list');

async function clearDebt(message, client) {
  const sender = message.from;
  const playerName = getPlayerName(message.sender.pushname)

  try {
    const [,debtorName] = message.body.split("|")
    console.log(debtorName)
    if(!!debtorName && isAdmin(sender)) {
      await clearDebtService(debtorName)
      await client.sendText(sender, `${debtorName.trim()}, foi marcado como pago`)
    }else {
      await clearDebtService(playerName)
      await client.sendText(sender, `${playerName}, foi marcado como pago`)
    }
   
    await getDebtorsList(message,client);
  } catch (error) {
    await client.sendText(sender, error.message)
  }
}

module.exports = clearDebt