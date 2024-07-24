const api = require('../config/config-http');

async function clearDebt(name, byPass = false) {
  const { data: debtors } = await api.get(`/debtors?name=${name.trim()}`)

  if(debtors.length === 0) throw new Error('Jogador não encontrado na lista de pagantes')
    
  const [debtor] = debtors;

  if(debtor.paid && !byPass) {
    throw new Error('Ops! Parece que o seu nome já consta como pago')
  }

  await api.patch(`/debtors/${debtor.id}`, { paid: true })

  return debtor;
}

module.exports = clearDebt;



