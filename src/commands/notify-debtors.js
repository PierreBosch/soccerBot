
const isAdmin = require("../permissions");
const getBillingTemplate = require("../templates/get-billing-template");
const delay = require("../util/delay");
const getPlayerName = require('../util/extract-first-and-last-name');
const api = require('../config/config-http');

async function getDebtors() {
  const response = await api.get('/debtors?_embed=player')

  return response.data
}

const GENERIC_MESSAGE = 0;
const PENDING_PAYMENT = 1;
const THANKFUL_PAYMENT = 2;

async function notifyDebtors(message, client) {
  const senderId = message.sender.id;

  if(isAdmin(senderId)) {
    const template = message.body.split('|')[1] ?? '0';
    const debtors = await getDebtors();
    const billingTemplate = getBillingTemplate(Number(template));

    debtors.map(async (debtor) => {
      switch(Number(template)) {
        case GENERIC_MESSAGE: 
          await client.sendText(debtor.player.phoneNumber, billingTemplate.replace(/{nome}/g, getPlayerName(debtor.player.name, true)));
          await delay(8000);
          break;
        case PENDING_PAYMENT: 
          if(debtor.paid === false) {
            await client.sendText(debtor.player.phoneNumber, billingTemplate.replace(/{nome}/g, getPlayerName(debtor.player.name, true)));
            await delay(8000);
          }
          break;
        case THANKFUL_PAYMENT: 
          if(debtor.paid === true) {
            await client.sendText(debtor.player.phoneNumber, billingTemplate.replace(/{nome}/g, getPlayerName(debtor.player.name, true)));
            await delay(8000);
          }
          break;
        default:
          console.log("Não faz nada.");
          break;
      }
    })
  } else {
    await client.sendText(messsage.from, 'Somente admins, podem disparar mensagem de cobrança');
  }
}

module.exports = notifyDebtors;