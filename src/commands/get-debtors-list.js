const isAdmin = require("../permissions");
const getDebtorsListTemplate = require("../templates/get-debtors-list-template");

async function getDebtorsList(message, client, byPassAdmin = false) {
  const senderId = message.sender.id;
  const sender = message.from;

  if(!isAdmin(senderId) && !byPassAdmin)  {
    return client.sendText(sender, 'Somente admins podem mostrar a lista de pagantes');
  }

  const debtorsListTemplate = await getDebtorsListTemplate();

  return await client.sendText(sender, debtorsListTemplate);
}

 

module.exports = getDebtorsList