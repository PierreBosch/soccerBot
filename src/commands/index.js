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

const commands = ({
  '/add': addPlayer,
  '/goleiro': addGoalKeeper,
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
  '/cobrar': sendPaymentMessages,
  '/limpar-serasa': deleteDebtorsList,
  '/serasa': createDebtorsList,
  '/pago': clearDebt,
  '/parmegiana': getAudioParmegiana,
  '/vidao': getVidaoAudio,
})


function executeCommand(command, ...args) {
  const func = commands[command];
  
  if (!func) throw new Error(`Comando ${command} não encontrado.`);

  return func(...args);
}

function start(client) {
  client.onMessage(async (message) => {
      const [command] = message.body.toLowerCase().split(' ');
      
      if(command.trim().startsWith('/')) {
        executeCommand(command, message, client)
      }
  });
}

  
module.exports = start;;