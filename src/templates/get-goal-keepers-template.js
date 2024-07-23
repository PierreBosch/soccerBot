function getGoalKeepersTemplate(goalKeepersList) {
  let goalKeepers =  goalKeepersList.map((goalKepper, index) => `🧤${index + 1}. ${goalKepper.name}`).join('\n');

  const goalKeepersLength = goalKeepersList.length;

  if(goalKeepersLength < 2) {
      for(let i = goalKeepersLength + 1; i <= 2; i++) {
          goalKeepers += `\n🧤${i}.`;
      }
  }

  return goalKeepers;
}

module.exports = getGoalKeepersTemplate