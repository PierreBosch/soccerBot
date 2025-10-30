const clearDebtService = require('../http/clear-debt');
const isAdmin = require('../permissions');
const getPlayerName = require('../util/extract-first-and-last-name');
const createDebtorsList = require('./create-debtors-list');
const getDebtorsList = require('./get-debtors-list');
const getBillingTemplate = require("../templates/get-billing-template");
const isEmpty = require('lodash/isEmpty');
const isGroupMessage = require('../util/is-group-message');

async function clearDebt(message, client) {
  const senderId = message.sender.id;
  const author = message.author;
  const sender = message.from;
  const playerName = getPlayerName(message.sender.pushname)
  const billingTemplate = getBillingTemplate(3);

  try {
    const [,debtorName] = message.body.split("|").map(s => s.trim())

    const byPassAdmin = true;
    await createDebtorsList(message, client, byPassAdmin);
   
    if(!!debtorName && isAdmin(senderId)) {
      await clearDebtService(debtorName, true)
    } else {
      await clearDebtService(playerName)
    }

    const debtorNameToNotify = isEmpty(debtorName) ? playerName : debtorName;
   
    await getDebtorsList(message,client, true);
    await client.sendText(isGroupMessage(message) ? author : sender, billingTemplate.replace(/{nome}/g, getPlayerName(debtorNameToNotify, true))); 
  } catch (error) {
    await client.sendText(sender, error.message)
  }
}

module.exports = clearDebt