const getDebtorsListService = require('../http/get-debtors-list');
const deleteDebtorsListService = require('../http/delete-debtors-list');
const isAdmin = require('../permissions');

async function deleteDebtorsList(message, client) {
  const sender = message.from;

  if(!isAdmin(sender)) await client.sendText(sender, 'Somente admins podem deletar a lista de pagantes')

  const debtors = await getDebtorsListService();
  await deleteDebtorsListService(debtors);
  
  await client.sendText(sender, `A lista de devedores foi de arrasta pra cima! Só aguardando pela próxima...`)
}

module.exports = deleteDebtorsList;