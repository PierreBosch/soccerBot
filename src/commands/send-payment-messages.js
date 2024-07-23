const getBillingPhones = require("../http/get-billing-phones");
const getBillingTemplate = require("../templates/get-billing-template");
const delay = require("../util/delay");
const getPlayerName = require('../util/extract-first-and-last-name');

const ADMIN_WHATSAPP_ID = "554896742125@c.us"

async function sendPaymentMessages(message, client) {
  if(message.sender.id === ADMIN_WHATSAPP_ID) {
    const billingPhones = await getBillingPhones()
    const billingTemplate = getBillingTemplate();

    billingPhones.map(async (billing) => {
      await client.sendText(billing.phone, billingTemplate.replace(/{nome}/g, getPlayerName(billing.name, true)));
      await delay(8000);
    })
  }
}

module.exports = sendPaymentMessages;