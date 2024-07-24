const api = require('../config/config-http');

async function createDebtorsList(debtors) {
  debtors.map(async debtorName => {
    await api.post('/debtors', { name: debtorName, paid: false })
  })
}

module.exports = createDebtorsList