const deleteBarbecueEaterService = require('../http/delete-barbecue-eater');
const getPlayerName = require('../util/extract-first-and-last-name');
const getBarbecueEaters = require('./get-barbecue-eaters');

async function deleteBarbecueEater(message, client) {
  try {
    const playerName = message.sender.pushname;

    await deleteBarbecueEaterService(getPlayerName(playerName));
    await getBarbecueEaters(message,client);
   
  } catch (error) {
      console.log(error)
  }
}

module.exports = deleteBarbecueEater;