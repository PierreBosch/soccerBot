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
})


function executeCommand(command, ...args) {
  const func = commands[command];
  
  if (!func) throw new Error(`Comando ${command} não encontrado.`);

  return func(...args);
}

function start(client) {
  client.onMessage(async (message) => {
      const command = message.body.toLowerCase();
      
      executeCommand(command, message, client)
  });
}

  
module.exports = start;;