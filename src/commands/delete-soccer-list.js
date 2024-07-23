const deleteSoccerListService = require('../http/delete-soccer-list');
const funnyPhrasesOnReset = require('../sentences/funny-on-reset');
const getRandomFunSentence = require('../util/get-random-fun-sentence');

const ADMIN_WHATSAPP_ID = "554896742125@c.us"

const onlyAdminsCanDeleteSoccerListException = "To de 👀 no senhor! Somente o administrador pode resetar a lista"

async function deleteSoccerList(message, client) {
  const senderId = message.sender.id; 
  const sender = message.from;

  if(senderId === ADMIN_WHATSAPP_ID) {
    try {
        await deleteSoccerListService();

        const funnyAnswer = getRandomFunSentence(funnyPhrasesOnReset)
        await client.sendText(sender, funnyAnswer)
        
    } catch (error) {
        console.log(error)
    }
  } else {
    await client.sendText(sender, onlyAdminsCanDeleteSoccerListException)
  }
}

module.exports = deleteSoccerList

