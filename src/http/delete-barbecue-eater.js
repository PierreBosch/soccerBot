const api = require('../config/config-http');

async function deleteBarbecueEater(name) {
  const { data: barbecueEaters } = await api.get(`/barbecueEaters?name=${name}`)

  if(barbecueEaters.length > 0)  {
    const [ barbecueEater ] = barbecueEaters;
      
    await api.delete(`/barbecueEaters/${barbecueEater.id}`)
  }
}

module.exports = deleteBarbecueEater