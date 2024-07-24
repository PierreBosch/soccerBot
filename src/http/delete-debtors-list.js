const api = require('../config/config-http');

async function deleteDebtorsList(debtors) {
  debtors.map(async debtor => {
    await api.delete(`/debtors/${debtor.id}`)
  })
}

module.exports = deleteDebtorsList