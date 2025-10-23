const api = require('../config/config-http');

async function setScore(score = false) {
  const [homeScore, awayScore] = score.split('x').map(Number);

  const scoreBody = [
        {
          "subCompositionName": "Content",
          "payload": {
            "GoalsAway": awayScore,
            "GoalsHome": homeScore
          }
        }
  ]

  await api.patch(`https://app.singular.live/apiv2/controlapps/3bqdDm3kk3TcnTyFtIludl/control`, scoreBody)
}

module.exports = setScore;



