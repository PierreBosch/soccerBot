const getDebtorsListService = require("../http/get-debtors-list");
const formatToBRL = require("../util/format-currency-brl");

function getDebtorsList(debtors) {
  let debtorsList = debtors.sort((a, b) => {
    if (a.paid === b.paid) {
      return 0; 
    }
    
    return a.paid ? -1 : 1; 
  }).map((debtor, index) => {
    const soccer = debtor.soccer ? '⚽' : '';
    const barbecue = debtor.barbecue ? '🥩' : '';
    const coke = debtor.coke ? '🥤' : '';

    let debitValue = 0;
    
    debitValue += soccer ? 14 : 0;
    debitValue += barbecue ? 20 : 0;
    debitValue += coke ? 7 : 0; 

    return `${debtor.paid ? '✅': '❌'} ${debtor.name.trim()} ${soccer.trim()}${barbecue.trim()}${coke.trim()}\n  \`\`\`Valor: [${formatToBRL(debitValue)}]\`\`\``
  }).join('\n\n');

  return debtorsList
}


async function getDebtorsListTemplate() {
  const debtors = await getDebtorsListService();

  return `*💰 Pagamentos Futebol e Pós*

*🟠 Banco Inter*\n
Chave (48) 99674-2125 

${getDebtorsList(debtors).trim()}

_Contamos com a cooperação de todos_`;
}

module.exports = getDebtorsListTemplate;