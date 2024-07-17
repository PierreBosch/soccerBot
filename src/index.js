"use strict";

const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');

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
    console.log("players",players)
    if(players.length > 0) {
        const [ player ] = players;
        
        await axios.delete(`http://localhost:3001/players/${player.id}`)
    } else {
        const { data: goalKeepers } = await axios.get(`http://localhost:3001/goalKeepers?name=${name}`)
        console.log("goalkeeper",goalKeepers)
        if(goalKeepers.length > 0) {
            const [ goalKeeper ] = goalKeepers;
            
            await axios.delete(`http://localhost:3001/goalKeepers/${goalKeeper.id}`)
        }
    }
}

function getPlayersList(playersList, goalKeepersList) {
    const players = playersList.map((player, index) => `🏃🏻${index + 1}. ${player.name}`).join('\n');

    const goalKeepers =  goalKeepersList.map((goalKepper, index) => `🧤${index + 1}. ${goalKepper.name}`).join('\n');

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

function getOnlyShortPlayerName(playerName) {
    const match = playerName.trim().match(/^\S+/);
    return match ? match[0] : '';
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

function getTemplateGoalKeeper() {
    const template = `
*Goleiros*`;

    return template
}


async function start(client) {
    client.onMessage(async (message) => {
        // if(message.chatId === "120363144278270676@g.us"){
            if(message.body.toLowerCase().includes("/reset")) {
                try {
                    await resetSoccerList();

                    client
                    .sendText(message.from, 'Lista resetada')
                    .then((result) => {

                    })

                } catch (error) {
                    console.log(error)
                }
            }

            if(message.body.toLowerCase().includes("/add")) {
                try {
                    await addPlayer(getOnlyShortPlayerName(message.sender.pushname));
                    
                    const playersList = await getPlayers();
                    const goalKeepersList = await getGoalKeepers();

                    const { players, goalKeepers } = getPlayersList(playersList, goalKeepersList)

                    const templateText = `${getTemplateHeader().trim()}\n\n${players.trim()}`;
                    const template = goalKeepers.length > 0 ? `${templateText.trim()}\n${getTemplateGoalKeeper()}\n\n${goalKeepers.trim()}` : templateText

                    client
                    .sendText(message.from, template)
                    .then((result) => {

                    })

                } catch (error) {
                    console.log(error)
                }
            }

            if(message.body.toLowerCase().includes("/out")) {
                try {
                    await removePlayerOrGoalKeeper(getOnlyShortPlayerName(message.sender.pushname));
                    
                    const playersList = await getPlayers();
                    const goalKeepersList = await getGoalKeepers();

                    const { players, goalKeepers } = getPlayersList(playersList, goalKeepersList)

                    const templateText = `${getTemplateHeader().trim()}\n\n${players.trim()}`;
                    const template = goalKeepers.length > 0 ? `${templateText.trim()}\n${getTemplateGoalKeeper()}\n\n${goalKeepers.trim()}` : templateText

                    client
                    .sendText(message.from, template)
                    .then((result) => {

                    })

                } catch (error) {
                    console.log(error)
                }
            }

            if(message.body.toLowerCase().includes("/gol")) {

                try {
                    await addGoalKeeper(getOnlyShortPlayerName(message.sender.pushname));

                    const playersList = await getPlayers();
                    const goalKeepersList = await getGoalKeepers();
         
                    const { players, goalKeepers } = getPlayersList(playersList, goalKeepersList)

                    const templateText = `${getTemplateHeader().trim()}\n\n${players.trim()}`;
                    const template = goalKeepers.length > 0 ? `${templateText.trim()}\n${getTemplateGoalKeeper()}\n\n${goalKeepers.trim()}` : templateText

                    client
                    .sendText(message.from, template)
                    .then((result) => {

                    })

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
    
    });
}

