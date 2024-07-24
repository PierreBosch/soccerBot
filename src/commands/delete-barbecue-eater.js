const deleteBarbecueEaterService = require('../http/delete-barbecue-eater');
const isAdmin = require('../permissions');
const getPlayerName = require('../util/extract-first-and-last-name');
const getBarbecueEaters = require('./get-barbecue-eaters');

async function deleteBarbecueEater(message, client) {
  try {
    const playerName = message.sender.pushname;
    const senderId = message.sender.id;

    const [,barbecueEaterGuest] = message.body.split("|")

    if(isAdmin(senderId) && !!barbecueEaterGuest) {
      await deleteBarbecueEaterService(getPlayerName(barbecueEaterGuest))
    } else {
      await deleteBarbecueEaterService(getPlayerName(playerName));
    }

    await getBarbecueEaters(message,client);
   
  } catch (error) {
      console.log(error)
  }
}

module.exports = deleteBarbecueEater;