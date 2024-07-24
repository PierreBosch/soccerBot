const getDebtorsListService = require("../http/get-debtors-list");

function getDebtorsList(debtors) {
  let debtorsList = debtors.map((debtor, index) => `${index + 1}. ${debtor.paid ? '✅': '❌'} ${debtor.name}`).join('\n');

  return debtorsList
}


async function getDebtorsListTemplate() {
  const debtors = await getDebtorsListService();

  return `*💰 Pagamentos Futebol e Pós*

Chave (48) 99674-2125 (Bradesco)

${getDebtorsList(debtors).trim()}

_Contamos com a cooperação de todos_`;
}

module.exports = getDebtorsListTemplate;