const api = require("../config/config-http")
const getBarbecueEaters = require("../http/get-barbecue-eaters");
const isAdmin = require("../permissions");

const onlyAdminsCanDeleteBarbecueListException = 'Somente admins podem deletar a lista do churrasco'

async function deleteBarbecueEatersList(message, client) {
 const senderId = message.sender.id; 
 const sender = message.from;

 if(!isAdmin(senderId)) {
  return await client.sendText(sender, onlyAdminsCanDeleteBarbecueListException)
 }

 const barbecueEaters = await getBarbecueEaters();
  
 if(barbecueEaters.length > 0) {
  barbecueEaters.forEach(async (barbecueEater) => {
    await api.delete(`/barbecueEaters/${id}`)
  });
 }

 return await client.sendText(sender, 'Lista do churras foi de arrasta pra cima! Só esperando pela próxima...')
}

module.exports = deleteBarbecueEatersList