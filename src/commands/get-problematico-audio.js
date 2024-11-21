const fs = require('fs');
const path = require('path');

function convertOggToBase64(filePath) {
    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString('base64');
    return base64Audio;
}

async function getProblematicoAudio(message, client) {
    const sender = message.from;
    const filePath = path.resolve(__dirname, '../audios/audio-problematico.mp3');
    let base64String = convertOggToBase64(filePath);

    base64String = `data:audio/mp3;base64,${base64String}`;

    await client.sendFile(sender, base64String);
    await client.sendText(sender, 'A se é por isso então ta porque tu não confirmou pra mim se tu ia trabalhar ou não, isso tu não deixou claro, ah então ta certo, isso... ta certo, mas é porque tu falou ali do almoço, tu já ta agoniado, tu já.. é que isso tu não quer perder nada, entendeu? Ah faz o que tu achar melhor Rafael, se tu quiser ir nesse churrasco ai do futebol vai... Ai porque tu é assim, tu... tu não quer perder nada né, é incrível, é problemático isso ai em ti!')

}

module.exports = getProblematicoAudio;


