function getWaitingListTemplate(list, isGoalKeepersList = false) {
  const waitingList = list.filter(player => (player.isWaitingList === true) ?? false)
  const emoji = isGoalKeepersList ? '🧤' : '🏃🏻'
  const waitingListTemplate = waitingList.map((player, index) => `${emoji}${index + 1}. ${player.name}`).join('\n');

  
  const result = waitingListTemplate !== '' ?? null

  console.log('waiting list', typeof waitingListTemplate)
  
  return result
}

module.exports = getWaitingListTemplate;