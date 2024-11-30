function getTemplateBeachTennis(array) {
  const limite = 6;
  const lista = [];

  for (let i = 0; i < limite; i++) {
    const numero = i + 1;
    const nome = array[i]?.name || ""; 
    lista.push(`${numero}. 🎾 ${nome}`.trim()); 
  }

  const header = `
🗓️ *Dia da semana:* Segunda-feira
⏰ *Horário:* 21h as 23h
🏖️ *Quadra:* Andrino 1

*🤖 Comandos*

*Participar*
_Digite_ \`/vou\` _para participar_

*Desistir*
_Digite_ \`/naovou\` _para sair da lista_

*Participantes*
`;

const footer = `
 *_Conto com vocês!_*
`;

  return `${header}\n${lista.join("\n")}\n${footer}`;
}

module.exports = {
  getTemplateBeachTennis
}