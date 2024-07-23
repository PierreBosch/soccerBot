function getPlayersTemplate(playersList) {
  let players = playersList.map((player, index) => `🏃🏻${index + 1}. ${player.name}`).join('\n');

  const playersLength = playersList.length;

  if(playersLength < 16) {
      for(let i = playersLength + 1; i <= 16; i++) {
          players += `\n🏃🏻${i}.`;
      }
  }

  return players
}

module.exports = getPlayersTemplate;