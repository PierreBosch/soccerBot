const getBarbecueEaters = require("../http/get-barbecue-eaters");

function getBarbecueList(barbecueList) {
  let barbecueEaters = barbecueList.map((barbecueEater, index) => `${index + 1}. 🥩 ${barbecueEater.name}${barbecueEater.stayForCoke ? '🥤' : ''}`).join('\n');
  
  const barbecueEatersLength = barbecueList.length;

  if(barbecueEatersLength < 8) {
      for(let i = barbecueEatersLength + 1; i <= 8; i++) {
        barbecueEaters += `\n${i}. 🥩`;
      }
  }

  return barbecueEaters
}


async function getBarbecueEatersTemplate() {
  const barbecueEaters = await getBarbecueEaters();

  return `*🍖 Churrasco Pós-Futebol*

📅 *Data*: Quarta-feira
🕢 *Horário*: 20h00
💵 *Valor*: R$ 20,00

*Participantes*

${getBarbecueList(barbecueEaters).trim()}

*💰Pagamento antecipado*

Chave (48) 99674-2125 (Bradesco)

_Contamos com a presença de todos_`;
}

module.exports = getBarbecueEatersTemplate;