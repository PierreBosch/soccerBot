const getPlayers = require('../http/get-players');
const addPlayerService = require('../http/add-player');
const getPlayerName = require('../util/extract-first-and-last-name');
const getSoccerListTemplate = require('../templates/get-soccer-list-template');
const getRandomFunSentence = require('../util/get-random-fun-sentence');
const funnyPhrasesOnAdd = require('../sentences/funny-on-add');
const { isEmpty } = require('lodash');

const soldOutExceptionAnswer = 'A lista com 16 jogadores já está completa, você foi colocado na lista de espera'
const playerAlreadyExistsException = 'Você já está na lista do futebol, seu nome não pode ser adicionado mais de uma vez'

const playersWithRestriction = []

async function addPlayer(message, client, args = {}) {
  try {
      const today = new Date();
      const isWednesday = today.getDay() === 3; // 0=Dom, 1=Seg, 2=Ter, 3=Qua,...

      const guestName = message.body.split('|')[1] ?? args?.nome;
      const isGuest = !isEmpty(guestName);
      
      const playerName = isGuest ? guestName.trim() : message.sender.pushname;  
      const sender = message.from;
      const playerPhoneNumber = !isGuest ?  message.sender.id : null;

      const currentPlayersList =  await getPlayers(false, true);
      
      const playerNameExists = currentPlayersList.find(player => player.name === getPlayerName(playerName))

      if(playerNameExists) {
        return await client.sendText(sender, playerAlreadyExistsException)
      }

      if(playersWithRestriction.includes(message.sender.id) && !isWednesday) {
        await addPlayerService({ name: getPlayerName(playerName), phoneNumber: playerPhoneNumber }, true);
        
        return await client.sendText(
          message.from,
          `⚠️ *Atenção!* ⚠️\n\nPercebemos que você não conseguiu avisar sobre a ausência no último jogo, então, para manter tudo organizado e justo pra todos, seu nome ficará em *restrição* até 🗓️ *quarta-feira*, dia do jogo.\n\nVocê ficará na lista de espera e poderá adicionar seu nome novamente somente no dia do jogo, caso ainda haja vagas disponíveis ✅.\n\nAgradecemos pela compreensão!\n\nNosso objetivo é garantir a organização dos jogos e dar oportunidade para todos participarem ⚽️🤝.`
        );
      }


      if(currentPlayersList.length === 16) {
        const isWaitingList= true;
        
        await addPlayerService({ name: getPlayerName(playerName), phoneNumber: playerPhoneNumber }, isWaitingList)
        return await client.sendText(sender, soldOutExceptionAnswer)
      }
      await addPlayerService({ name: getPlayerName(playerName), phoneNumber: playerPhoneNumber })
      
      const firstName = getPlayerName(playerName, true);
      const funnyAnswer = getRandomFunSentence(funnyPhrasesOnAdd, firstName);

      const soccerListTemplate = await getSoccerListTemplate();

      await client.sendText(sender, soccerListTemplate);
      await client.sendText(sender, funnyAnswer);
        
  } catch (error) {
      console.log(error)
  }
}

module.exports = addPlayer;