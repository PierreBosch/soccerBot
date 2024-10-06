function getWaitingListTemplate(list, isGoalKeepersList = false) {
  const waitingList = list.filter(player => player.isWaitingList === true)
  const emoji = isGoalKeepersList ? '🧤' : '🏃🏻'
  const waitingListTemplate = waitingList.map((player, index) => `${emoji}${index + 1}. ${player.name}`).join('\n');

  const result = waitingList.length === 0 ? waitingListTemplate : ''

  return result
}

module.exports = getWaitingListTemplate;