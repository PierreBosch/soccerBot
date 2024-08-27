const fs = require('fs');
const path = require('path');

function convertOggToBase64(filePath) {
    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString('base64');
    return base64Audio;
}

async function getAudioParmegiana(message, client) {
    const sender = message.from;
    const filePath = path.resolve(__dirname, '../audios/audio-parmegiana.mp3');
    let base64String = convertOggToBase64(filePath);

    base64String = `data:audio/mp3;base64,${base64String}`;

    await client.sendFile(sender, base64String);
    await client.sendText(sender, 'O Rafael, tu é foda, né? Tu vai pro o futebol pra fazer exercício ou pra comer. Já vai ter um churrasco hoje, já vai ter churrasco na quinta, qué amanhã também? Ohhhh Senhor amado!! A vida é um lazer mesmo, né?  O vidão, hein!')

}

module.exports = getAudioParmegiana;


