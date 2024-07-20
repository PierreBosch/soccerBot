"use strict";

const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');
const funnyPhrasesOnLeave = require('./sentences/funny-on-leave')
const funnyPhrasesOnAdd = require('./sentences/funny-on-add')
const funnyPhrasesOnAddGK = require('./sentences/funny-on-add-gk')
const funnyPhrasesOnReset = require('./sentences/funny-on-reset')
const funnyPhrasesOnFoodMenu = require('./sentences/funny-on-food-menu');
const funnyOnFoodMenu = require('./sentences/funny-on-food-menu');

const ADMIN_WHATSAPP_ID = "554896742125@c.us"

wppconnect
    .create({
    session: 'sessionName',
    catchQR: (base64Qr, asciiQR) => {
        console.log(asciiQR); // Optional to log the QR in the terminal
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');
        var imageBuffer = response;
        require('fs').writeFile('out.png', imageBuffer['data'], 'binary', function (err) {
            if (err != null) {
                console.log(err);
            }
        });
    },
    logQR: false,
})
    .then((client) => start(client))
    .catch((error) => console.log(error));

async function addPlayer(name) {
    await axios.post('http://localhost:3001/players', { name })
}

async function getPlayers() {
    const response = await axios.get('http://localhost:3001/players')

    return response.data
}

async function addGoalKeeper(name) {
    await axios.post('http://localhost:3001/goalKeepers', { name })
}

async function getGoalKeepers() {
    const response = await axios.get('http://localhost:3001/goalKeepers')

    return response.data
}

async function removePlayerOrGoalKeeper(name) {
    const { data: players } = await axios.get(`http://localhost:3001/players?name=${name}`)

    if(players.length > 0) {
        const [ player ] = players;
        
        await axios.delete(`http://localhost:3001/players/${player.id}`)
    } else {
        const { data: goalKeepers } = await axios.get(`http://localhost:3001/goalKeepers?name=${name}`)

        if(goalKeepers.length > 0) {
            const [ goalKeeper ] = goalKeepers;
            
            await axios.delete(`http://localhost:3001/goalKeepers/${goalKeeper.id}`)
        }
    }
}

function getPlayersList(playersList, goalKeepersList) {
    let players = playersList.map((player, index) => `🏃🏻${index + 1}. ${player.name}`).join('\n');

    const playersLength = playersList.length;

    if(playersLength < 16) {
        for(let i = playersLength + 1; i <= 16; i++) {
            players += `\n🏃🏻${i}.`;
        }
    }

    let goalKeepers =  goalKeepersList.map((goalKepper, index) => `🧤${index + 1}. ${goalKepper.name}`).join('\n');

    const goalKeepersLength = goalKeepersList.length;

    if(goalKeepersLength < 2) {
        for(let i = goalKeepersLength + 1; i <= 2; i++) {
            goalKeepers += `\n🧤${i}.`;
        }
    }

    return { players, goalKeepers }
}

async function resetSoccerList() {
    const playersList = await getPlayers()
    const goalKeepersList = await getGoalKeepers()

    const playerIds = playersList.map(player => player.id)
    const goalKeeperIds = goalKeepersList.map(player => player.id)
    
    playerIds.forEach(async (id) => axios.delete(`http://localhost:3001/players/${id}`))
    goalKeeperIds.forEach(async (id) => axios.delete(`http://localhost:3001/goalKeepers/${id}`))
}


function getTemplateHeader() {
    const template = `*📢 Avisos*

⚽ Futebol Quarta-feira⏱19h30
🏟 Estádio: Santiago Bernandrino
    
🚨 Evite desistências
🚨 6 na linha 1 no Gol e 2 reservas
    
*Jogadores*
`;

    return template
}

function getMenuTemplate() {
    const template = `*👨🏻‍🍳 Cardápio*

🥩 Churrasco
🥖 Pão de alho 
🫘 Salame Cancelier Puro`;

    return template
}

function getTemplateGoalKeeper() {
    const template = `
*Goleiros*`;

    return template
}

function getRandomFunPhrase(sentences, name = 'Pierre') {
    const randomId = Math.floor(Math.random() * sentences.length);
    const phrase = sentences[randomId];
    return phrase.replace(/{nome}/g, name);
}
  

function getAvailableCommandsTemplate() {
    const template = `\`\`\`Comandos Disponíveis

/lista - mostra lista atual de jogadores e goleiros

/add - adiciona automaticamente seu nome na lista como jogador de linha

/goleiro - adiciona automaticamente seu nome na lista como goleiro

/fora - retira seu nome automaticamente da lista

/pix - mostra a chave pix para pagamentos do churrasco futebol refri

/jogo - mostra o valor a pagar do jogo

/coca - mostra o valor a pagar da coca

/churrasco - mostra o valor a pagar do churrasco

/cardapio - mostra o cardápio da semana

/escalacao - mostra a escalação da semana

/ajuda - mostra os comandos disponíveis\`\`\``;

    return template
}

function extractFirstAndLastName(fullName, onlyFirstName = false) {
    const words = fullName.trim().split(/\s+/);

    if(onlyFirstName) return words[0]

    if (words.length >= 2) {
        return words[0] + ' ' + words[1];
    } else {
        return fullName;
    }
}


function start(client) {
    client.onMessage(async (message) => {
        // if(message.chatId === "120363144278270676@g.us"){
             if(message.body.toLowerCase().includes("/lista")) {
                try {
                    const playersList = await getPlayers();
                    const goalKeepersList = await getGoalKeepers();

                    const { players, goalKeepers } = getPlayersList(playersList, goalKeepersList)

                    const templateText = `${getTemplateHeader().trim()}\n\n${players.trim()}`;
                    const template = goalKeepers.length > 0 ? `${templateText.trim()}\n${getTemplateGoalKeeper()}\n\n${goalKeepers.trim()}` : templateText

                    client
                    .sendText(message.from, template)
                    .then((result) => {})

                } catch (error) {
                    console.log(error)
                }
            }

            if(message.body.toLowerCase().includes("/limpar")) {
                if(message.sender.id === ADMIN_WHATSAPP_ID) {
                    try {
                        await resetSoccerList();
    
                        client
                        .sendText(message.from, getRandomFunPhrase(funnyPhrasesOnReset))
                        .then(() => { console.log('lista_resetada')})

                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    client
                    .sendText(message.from,'To de 👀 no senhor! Somente o administrador pode resetar a lista')
                    .then((result) => {})
                }
            }

            if(message.body.toLowerCase().includes("/add")) {
                try {
                    const currentPlayersList =  await getPlayers();
  
                    if(currentPlayersList.length < 16) {
                        await addPlayer(extractFirstAndLastName(message.sender.pushname));
                        
                        const playersList = await getPlayers();
                        const goalKeepersList = await getGoalKeepers();

                        const { players, goalKeepers } = getPlayersList(playersList, goalKeepersList)

                        const templateText = `${getTemplateHeader().trim()}\n\n${players.trim()}`;
                        const template = goalKeepers.length > 0 ? `${templateText.trim()}\n${getTemplateGoalKeeper()}\n\n${goalKeepers.trim()}` : templateText

                        client
                        .sendText(message.from, template)
                        .then((result) => { console.log('Player added')})

                        setTimeout(() => {
                            client
                            .sendText(message.from, getRandomFunPhrase(funnyPhrasesOnAdd, extractFirstAndLastName(message.sender.pushname, true)))
                            .then((result) => {

                            })
                        }, 300)
                    } else {
                        client
                        .sendText(message.from, `A lista com 16 jogadores já está completa, não é possível adicionar`)
                        .then((result) => { console.log('Lista cheia')})
                    }
                    
                } catch (error) {
                    console.log(error)
                }
            }

            if(message.body.toLowerCase().includes("/fora")) {
                try {
                    await removePlayerOrGoalKeeper(extractFirstAndLastName(message.sender.pushname));
                    
                    const playersList = await getPlayers();
                    const goalKeepersList = await getGoalKeepers();

                    const { players, goalKeepers } = getPlayersList(playersList, goalKeepersList)

                    const templateText = `${getTemplateHeader().trim()}\n\n${players.trim()}`;
                    const template = goalKeepers.length > 0 ? `${templateText.trim()}\n${getTemplateGoalKeeper()}\n\n${goalKeepers.trim()}` : templateText
                    
                    client
                    .sendText(message.from, template)
                    .then((result) => {

                    })

                   setTimeout(() => {
                    client
                    .sendText(message.from, getRandomFunPhrase(funnyPhrasesOnLeave, extractFirstAndLastName(message.sender.pushname, true)))
                    .then((result) => {

                    })
                   }, 300)
                } catch (error) {
                    console.log(error)
                }
            }

            if(message.body.toLowerCase().includes("/goleiro")) {
                const currentGoalKeepersList =  await await getGoalKeepers();

                try {
                    if(currentGoalKeepersList.length < 2) {
                        await addGoalKeeper(extractFirstAndLastName(message.sender.pushname));

                        const playersList = await getPlayers();
                        const goalKeepersList = await getGoalKeepers();
                        
                        const { players, goalKeepers } = getPlayersList(playersList, goalKeepersList)

                        const templateText = `${getTemplateHeader().trim()}\n\n${players.trim()}`;
                        const template = goalKeepers.length > 0 ? `${templateText.trim()}\n${getTemplateGoalKeeper()}\n\n${goalKeepers.trim()}` : templateText
                        
                        client
                        .sendText(message.from, template)
                        .then((result) => { console.log('Goal Keeper added')})

                        setTimeout(() => {
                            client
                            .sendText(message.from, getRandomFunPhrase(funnyPhrasesOnAddGK, extractFirstAndLastName(message.sender.pushname, true)))
                            .then((result) => {

                            })
                        }, 300)
                    }else {
                        client
                        .sendText(message.from, `A lista com 2 goleiros já está completa, não é possível adicionar`)
                        .then((result) => { console.log('Lista cheia')})
                    }
                } catch (error) {
                    console.log(error)
                }
            }

            if (message.body.toLowerCase().includes("/pix")) {
                client
                    .sendText(message.from, 'Chave (48) 99674-2125 (Bradesco)')
                    .then((result) => {

                })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            }

            if (message.body.toLowerCase().includes("/churrasco")) {
                client
                    .sendText(message.from, '💵 R$ 20,00')
                    .then((result) => {
       
                })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            }

            if (message.body.toLowerCase().includes("/jogo")) {
                client
                    .sendText(message.from, '💵 R$ 12,00')
                    .then((result) => {

                })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            }

            if (message.body.toLowerCase().includes("/coca")) {
                client
                    .sendText(message.from, '💵 R$ 5,00')
                    .then((result) => {

                })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            }

            if (message.body.toLowerCase().includes("/cardapio")) {
                client.sendText(message.from, getRandomFunPhrase(funnyOnFoodMenu))
                
                setTimeout(() => {
                    client
                    .sendText(message.from, getMenuTemplate())
                    .then(() => { console.log('food_menu')})
                }, 500)
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            }

            if (message.body.toLowerCase().includes("/escalacao")) {
                client
                    .sendImage(message.from, 'https://i.ibb.co/6tDwm7G/DOIS-TIMES-NO-MESMO-CAMPO-3.png')
                    .then((result) => {

                })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            }

            if (message.body.toLowerCase().includes("/ajuda")) {
                client
                    .sendText(message.from, getAvailableCommandsTemplate())
                    .then((result) => {

                })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            }
    
    });
}

