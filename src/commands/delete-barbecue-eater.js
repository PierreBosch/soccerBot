const deleteBarbecueEaterService = require('../http/delete-barbecue-eater');
const isAdmin = require('../permissions');
const getPlayerName = require('../util/extract-first-and-last-name');
const getBarbecueEaters = require('./get-barbecue-eaters');

async function deleteBarbecueEater(message, client, args = {}) {
  try {
    const playerName = message.sender.pushname;
    const senderId = message.sender.id;

    const barbecueEaterGuest = message.body.split("|")[1]?.trim() ?? args?.nome;
    const guestName = message.body.split('|')[1]?.trim() ?? args?.nome;

    if(isAdmin(senderId) && !!barbecueEaterGuest) {
      await deleteBarbecueEaterService(getPlayerName(guestName))
    } else {
      await deleteBarbecueEaterService(getPlayerName(playerName));
    }

    await getBarbecueEaters(message,client);
   
  } catch (error) {
      console.log(error)
  }
}

module.exports = deleteBarbecueEater;