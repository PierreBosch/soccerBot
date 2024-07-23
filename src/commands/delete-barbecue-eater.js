const deleteBarbecueEaterService = require('../http/delete-barbecue-eater');
const getPlayerName = require('../util/extract-first-and-last-name');
const getBarbecueEaters = require('./get-barbecue-eaters');

const ADMIN_WHATSAPP_ID = "554896742125@c.us"

async function deleteBarbecueEater(message, client) {
  try {
    const playerName = message.sender.pushname;
    const senderId = message.sender.id;

    const [,barbecueEaterGuest] = message.body.split("|")

    if(senderId === ADMIN_WHATSAPP_ID && !!barbecueEaterGuest) {
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