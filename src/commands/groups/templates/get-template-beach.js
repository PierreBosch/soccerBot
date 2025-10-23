function getTemplateBeachTennis(array, rules = null) {
  // Usar o limite das regras ou o padrão de 6
  const limite = (rules && rules.hasMaxParticipants) ? rules.maxParticipants : 6;
  const lista = [];

  for (let i = 0; i < limite; i++) {
    const numero = i + 1;
    const nome = array[i]?.name || ""; 
    lista.push(`${numero}. 🎾 ${nome}`.trim()); 
  }

  // Texto do limite de participantes
  const participantsHeaderText = (rules && rules.hasMaxParticipants)
    ? `*Participantes (Máx: ${rules.maxParticipants})*` 
    : '*Participantes*';

  const header = `
🗓️ *Dia da semana:* Segunda-feira
⏰ *Horário:* 19h as 21h
🏖️ *Quadra:* Andrino

*🤖 Comandos*

*Participar*
_Digite_ \`/vou\` _para participar_

*Desistir*
_Digite_ \`/naovou\` _para sair da lista_

${participantsHeaderText}
`;

const footer = `
 *_Conto com vocês!_*
`;

  return `${header}\n${lista.join("\n")}\n${footer}`;
}

module.exports = {
  getTemplateBeachTennis
}