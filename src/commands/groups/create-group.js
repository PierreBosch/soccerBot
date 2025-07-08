const groupService = require("./http/group-service");
const listService = require("./http/list-service");

async function createGroup(message, client) {
  try {
      const groupId = message.from;
      const [, ...groupNameAndConfig] = message.content.split(" ")

      if(!Boolean(groupNameAndConfig.join(''))) {
        return await client.sendText(groupId, `Opa! Faltou dar um nome para o grupo! \n\n Ex: \`/configurar Nome do grupo\`\n\nVocê também pode configurar regras:\n\`/configurar Nome do grupo --max=10 --preco=25\`\n(Isso configura um limite de 10 participantes e valor de R$ 25,00)`)
      }
      
      // Extrair configurações, se houver
      const configParams = groupNameAndConfig.filter(part => part.startsWith('--'));
      const groupName = groupNameAndConfig.filter(part => !part.startsWith('--'));
      
      // Configurar regras
      const rules = {
        maxParticipants: 6,
        hasMaxParticipants: true,
        price: 0,
        hasPrice: false
      };
      
      // Processar parâmetros de configuração
      configParams.forEach(param => {
        if (param.startsWith('--max=')) {
          const maxValue = parseInt(param.replace('--max=', ''));
          if (!isNaN(maxValue) && maxValue > 0) {
            rules.maxParticipants = maxValue;
            rules.hasMaxParticipants = true;
          }
        } else if (param.startsWith('--preco=') || param.startsWith('--preço=')) {
          const priceValue = parseFloat(param.replace(/--pre[çc]o=/, '').replace(',', '.'));
          if (!isNaN(priceValue) && priceValue >= 0) {
            rules.price = priceValue;
            rules.hasPrice = priceValue > 0;
          }
        } else if (param === '--sem-limite') {
          rules.hasMaxParticipants = false;
        }
      });
      
      await groupService.create(groupId, groupName.join(" "));
      await listService.create(groupName.join(" "), groupId, rules)     
      
      // Preparar mensagem de confirmação com as regras
      let configMsg = '';
      if (rules.hasMaxParticipants) {
        configMsg += `\n👥 Limite de participantes: ${rules.maxParticipants}`;
      } else {
        configMsg += '\n👥 Sem limite de participantes';
      }
      
      if (rules.hasPrice) {
        configMsg += `\n💰 Valor a pagar: R$ ${rules.price.toFixed(2)}`;
      }
      
      await client.sendText(groupId, `✅ Grupo _*${groupName.join(" ")}*_ configurado${configMsg}`)
  } catch (error) {
      console.log(error)
  }
}

module.exports = createGroup;



