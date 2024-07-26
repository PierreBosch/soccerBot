const getBillingPhones = require("../http/get-billing-phones");
const isAdmin = require("../permissions");
const getBillingTemplate = require("../templates/get-billing-template");
const delay = require("../util/delay");
const getPlayerName = require('../util/extract-first-and-last-name');

async function sendPaymentMessages(message, client) {
  const senderId = message.sender.id;

  if(isAdmin(senderId)) {
    const billingPhones = await getBillingPhones()
    const billingTemplate = getBillingTemplate();

    billingPhones.map(async (billing) => {
      await client.sendText(billing.phone, billingTemplate.replace(/{nome}/g, getPlayerName(billing.name, true)));
      await delay(8000);
    })
  } else {
    await client.sendText(messsage.from, 'Somente admins, podem disparar mensagem de cobrança');
  }
}

module.exports = sendPaymentMessages;