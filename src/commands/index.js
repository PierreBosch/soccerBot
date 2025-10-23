const addPlayer = require('./add-player');
const addGoalKeeper = require('./add-gk');
const getSoccerList = require('./get-soccer-list');
const deleteSoccerList = require('./delete-soccer-list');
const deletePlayer = require('./delete-player');
const getPixKey = require('./get-pix-key');
const getFoodMenu = require('./get-food-menu');
const getBarbecuePrice = require('./get-barbecue-price');
const getMatchPrice = require('./get-match-price');
const getCokePrice = require('./get-coke-price');
const getAvailableCommands = require('./get-available-commands');
const getLineup = require('./get-lineup');
const addBarbecueEater = require('./add-barbecue-eater');
const deleteBarbecueEater = require('./delete-barbecue-eater');
const getBarbecueEaters = require('./get-barbecue-eaters');
const sendPaymentMessages = require('./send-payment-messages');
const createDebtorsList = require('./create-debtors-list');
const clearDebt = require('./clear-debt');
const deleteDebtorsList = require('./delete-debtors-list');
const deleteBarbecueEatersList = require('./delete-barbecue-eaters-list');
const getAudioParmegiana = require('./get-audio-parmegiana');
const getVidaoAudio = require('./get-vidao-audio');
const addGuestToBarbecueList = require('./add-guest-to-barbecue-list');
const createMVPPoll = require('./create-mvp-poll');
const createGroup = require('./groups/create-group');
const getParticipantsList = require('./groups/get-participants-list');
const getProblematicoAudio = require('./get-problematico-audio');
const getAudioJantinha = require('./get-audio-jantinha');
const addParticipantList = require('./groups/add-participant-list');
const deleteParticipantList = require('./groups/delete-participant-list');
const clearParticipantsList = require('./groups/clear-participants-list');
const notifyDebtors = require('./notify-debtors');
const getLinkLive = require('./get-link-live');
const getLinkScoreControl = require('./get-link-score-control');
const createInviteBarbecue = require('./create-invite-barbecue');
const isInAllowedPeriod = require('../middlewares/is-in-allowed-period');
const setScore = require('./set-score');

const fetch = require('node-fetch');
const cron = require('node-cron');
const onGroupMention = require('../middlewares/on-group-mention');
const sendPlayersMessages = require('./send-players-messages');

const commands = ({
  '/add': isInAllowedPeriod(addPlayer),
  '/goleiro': isInAllowedPeriod(addGoalKeeper),
  '/lista': getSoccerList,
  '/limpar': deleteSoccerList,
  '/fora': deletePlayer,
  '/pix': getPixKey,
  '/coca': getCokePrice,
  '/cardapio': getFoodMenu,
  '/churrasco': getBarbecuePrice,
  '/jogo': getMatchPrice,
  '/ajuda': getAvailableCommands,
  '/escalacao': getLineup,
  '/add-churras': addBarbecueEater,
  '/fora-coca': addBarbecueEater,
  '/add-coca': addBarbecueEater,
  '/add-churras-coca': addBarbecueEater,
  '/fora-churras': deleteBarbecueEater,
  '/convidado-churras': addGuestToBarbecueList,
  '/convidado-churras-coca': addGuestToBarbecueList,
  '/convidado-coca': addGuestToBarbecueList,
  '/fora-coca-convidado': addGuestToBarbecueList,
  '/add-coca-convidado': addGuestToBarbecueList,
  '/lista-churras': getBarbecueEaters,
  '/limpar-churras': deleteBarbecueEatersList,
  '/notificar': notifyDebtors,
  '/limpar-serasa': deleteDebtorsList,
  '/serasa': createDebtorsList,
  '/pago': clearDebt,
  '/parmegiana': getAudioParmegiana,
  '/vidao': getVidaoAudio,
  '/mvp': createMVPPoll,
  '/problematico': getProblematicoAudio,
  '/configurar': createGroup,
  '/quemvai': getParticipantsList,
  '/vou': addParticipantList,
  '/naovou': deleteParticipantList,
  '/limpar-lista': clearParticipantsList,
  '/jantinha': getAudioJantinha,
  '/live': getLinkLive,
  '/controle-placar': getLinkScoreControl,
  '/convidar-churras': createInviteBarbecue,
  '/placar': setScore,
  '/enviar-convite': sendPlayersMessages,
})



function executeCommand(command, ...args) {
  const func = commands[command];
  
  if (!func) throw new Error(`Comando ${command} não encontrado.`);

  return func(...args);
}


const destinatario = '5511999999999@c.us';

let ultimoPlacar = '';
let tarefaCron = null; 
let cronAtivo = false;

function iniciarCron(client) {
  if (!cronAtivo) {
    tarefaCron = cron.schedule('*/1 * * * *', async () => {
      try {
        const response = await fetch('https://app.singular.live/apiv2/controlapps/3bqdDm3kk3TcnTyFtIludl/control');
        const dados = await response.json();
        console.log(dados)
        const [,,,placar] = dados;
        placarAtual = `${placar.payload.NameHome} ${placar.payload.GoalsHome} x ${placar.payload.GoalsAway} ${placar.payload.NameAway}`;

        if (placarAtual !== ultimoPlacar) {
          await client.sendText("120363144278270676@g.us", `Atualização do placar \n\n 🔴 ${placar.payload.NameHome} ${placar.payload.GoalsHome} x ${placar.payload.GoalsAway}  ${placar.payload.NameAway} 🔵`);
          ultimoPlacar = placarAtual;
          console.log('Placar enviado:', placarAtual);
        }
      } catch (error) {
        console.error('Erro ao buscar ou enviar placar:', error);
      }
    });
    cronAtivo = true;
  }
}

function pararCron() {
  if (cronAtivo && tarefaCron) {
    tarefaCron.stop();
    tarefaCron = null;
    cronAtivo = false;
  }
}

function start(client) {
  client.onMessage(async (message) => {
    
      if (message.body.toLowerCase() === 'ativar placar') {
        console.log('Iniciando cron para atualização do placar');
        iniciarCron(client);
        client.sendText(message.from, 'Atualização automática do placar ATIVADA!');
      }

      if (message.body.toLowerCase() === 'desativar placar') {
        console.log('Parando cron para atualização do placar');
        pararCron();
        client.sendText(message.from, 'Atualização automática do placar DESATIVADA!');
      }

      if (message.type === 'list_response' && 'listResponse' in message) {
        const selectedRowId = message.listResponse.singleSelectReply.selectedRowId;
        console.log(selectedRowId)
        switch (selectedRowId) {
          case 'add-churras-coca':
            await addBarbecueEater({...message, body: '/add-churras-coca'}, client)
            break;
          case 'add-churras':
            await addBarbecueEater({...message, body: '/add-churras'}, client)
            break;
          default:
            break;
        }
      }

      onGroupMention(client, message);

      const [command] = message.body.toLowerCase().split(' ');
      
      if(command.trim().startsWith('/')) {
        executeCommand(command, message, client)
      }
  });
}

  
module.exports = start;;