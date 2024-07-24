const isAdmin = require("../permissions");
const getDebtorsListTemplate = require("../templates/get-debtors-list-template");

async function getDebtorsList(message, client) {
  const sender = message.from;

  if(!isAdmin(sender)) await client.sendText(sender, 'Somente admins mostrar a lista de pagantes')

  const debtorsListTemplate = await getDebtorsListTemplate();

  await client.sendText(sender, debtorsListTemplate);
}

module.exports = getDebtorsList