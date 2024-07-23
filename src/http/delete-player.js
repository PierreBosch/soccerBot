const api = require('../config/config-http');

async function deletePlayer(name) {
  const { data: players } = await api.get(`/players?name=${name}`)

  if(players.length > 0) {
      const [ player ] = players;
      
      await api.delete(`/players/${player.id}`)
  } else {
      const { data: goalKeepers } = await api.get(`/goalKeepers?name=${name}`)

      if(goalKeepers.length > 0) {
          const [ goalKeeper ] = goalKeepers;
          
          await api.delete(`/goalKeepers/${goalKeeper.id}`)
      }
  }
}

module.exports = deletePlayer