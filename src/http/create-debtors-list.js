const api = require('../config/config-http');
const deleteDebtorsList = require('./delete-debtors-list');
const getBarbecueEaters = require('./get-barbecue-eaters');
const getDebtorsList = require('./get-debtors-list');
const getPlayers = require('./get-players');

async function createDebtorsList(debtors) {
  const players = await getPlayers();
  const barbecueEaters = await getBarbecueEaters();
  const debtorsList = await getDebtorsList();

  await deleteDebtorsList(debtorsList);

  debtors.map(async debtorName => {
    const foundInSoccerList = players.find(player => player.name === debtorName);
    const foundBarbecueList = barbecueEaters.find(barbecueEater => barbecueEater.name === debtorName)
    const foundDebtor = debtorsList.find(debtor => debtor.name === debtorName)

    let debtor = {
      name: debtorName,
      paid: !!foundDebtor ? foundDebtor.paid : false,
      soccer: !!foundInSoccerList,
      barbecue: !!foundBarbecueList,
      coke: !!foundBarbecueList ? foundBarbecueList.stayForCoke : false
    }

    if(!!foundDebtor) {
      return await api.put(`/debtors/${foundDebtor.id}`, { ...debtor })
    }

    return await api.post('/debtors', { ...debtor })
  })
}

module.exports = createDebtorsList