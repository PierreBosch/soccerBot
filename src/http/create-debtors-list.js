const api = require('../config/config-http');
const getBarbecueEaters = require('./get-barbecue-eaters');
const getDebtorsList = require('./get-debtors-list');
const getPlayers = require('./get-players');

async function createDebtorsList(debtors) {
  const players = await getPlayers();
  const barbecueEaters = await getBarbecueEaters();
  const debtorsList = await getDebtorsList();

  debtors.map(async debtorName => {
    const foundInSoccerList = players.find(player => player.name === debtorName);
    const foundBarbecueList = barbecueEaters.find(barbecueEater => barbecueEater.name === debtorName)
    const foundDebtor = debtorsList.find(debtor => debtor.name === debtorName)
    
    if(foundDebtor) return;

    let debtor = {
      name: debtorName,
      paid: false,
      soccer: !!foundInSoccerList,
      barbecue: !!foundBarbecueList,
      coke: !!foundBarbecueList ? foundBarbecueList.stayForCoke : false
    }

    return await api.post('/debtors', { ...debtor })
  })
}

module.exports = createDebtorsList