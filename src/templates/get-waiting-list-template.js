function getWaitingListTemplate(list, isGoalKeepersList = false) {
  const waitingList = list.filter(player => (player.isWaitingList === true) ?? false)
  const emoji = isGoalKeepersList ? '🧤' : '🏃🏻'
  const waitingListTemplate = waitingList.map((player, index) => `${emoji}${index + 1}. ${player.name}`).join('\n');

  return waitingListTemplate ?? null
}

module.exports = getWaitingListTemplate;