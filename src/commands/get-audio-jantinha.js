const fs = require('fs');
const path = require('path');

function convertOggToBase64(filePath) {
    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString('base64');
    return base64Audio;
}

async function getAudioJantinha(message, client) {
    const sender = message.from;
    const filePath = path.resolve(__dirname, '../audios/jantinha.mp3');
    let base64String = convertOggToBase64(filePath);

    base64String = `data:audio/mp3;base64,${base64String}`;

    await client.sendFile(sender, base64String);
    await client.sendText(sender, 'Mas antes de tu ir pro vidão aí na segunda-feira deixa a janta pronta pra mim, porque alguém do casal que trabalha né, e eu chego tarde então já deixa a jantinha pronta, daí tu pode ir.. ta..')

}

module.exports = getAudioJantinha;


