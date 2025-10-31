
const isAdmin = require("../permissions");
const getBillingTemplate = require("../templates/get-billing-template");
const delay = require("../util/delay");
const getPlayerName = require('../util/extract-first-and-last-name');
const api = require('../config/config-http');
const { notifyAdmins, notifyAdminProgress } = require('../util/notify-admins');

async function getDebtors() {
  const response = await api.get('/debtors?_embed=player')

  return response.data
}

const GENERIC_MESSAGE = 0;
const PENDING_PAYMENT = 1;
const PENDING_PAYMENT_LATE = 2; 
const THANKFUL_PAYMENT = 3;


async function notifyDebtors(message, client) {
  const senderId = message.sender.id;

  if(isAdmin(senderId)) {
    const template = message.body.split('|')[1] ?? '0';
    const debtors = await getDebtors();
    const billingTemplate = getBillingTemplate(Number(template));
    
    const templateNames = {
      0: 'Mensagem Genérica',
      1: 'Pagamento Pendente',
      2: 'Pagamento Atrasado',
      3: 'Agradecimento'
    };

    // Notificar admins do início
    await notifyAdmins(
      client,
      `🚀 *Iniciando Envio de Cobranças*\n\n` +
      `Template: ${templateNames[Number(template)]}\n` +
      `Total de devedores: ${debtors.length}\n` +
      `Delay entre mensagens: 8s\n\n` +
      `Aguarde...`,
      2000
    );

    let sent = 0;
    let skipped = 0;
    let errors = 0;

    // Usar for...of ao invés de map para garantir execução sequencial
    for (let i = 0; i < debtors.length; i++) {
      const debtor = debtors[i];
      
      // Validar se player existe
      if (!debtor.player || !debtor.player.name || !debtor.player.phoneNumber) {
        console.error(`⚠️ Devedor ${i + 1} sem dados de player:`, debtor);
        skipped++;
        continue;
      }
      
      const playerName = getPlayerName(debtor.player.name, true);
      
      try {
        let shouldSend = false;
        
        switch(Number(template)) {
          case GENERIC_MESSAGE: 
            shouldSend = true;
            break;
          case PENDING_PAYMENT: 
          case PENDING_PAYMENT_LATE: 
            shouldSend = debtor.paid === false;
            break;
          case THANKFUL_PAYMENT: 
            shouldSend = debtor.paid === true;
            break;
        }

        if (shouldSend) {
          await client.sendText(
            debtor.player.phoneNumber, 
            billingTemplate.replace(/{nome}/g, playerName)
          );
          sent++;
          
          // Notificar progresso a cada 5 mensagens ou na última
          if (sent % 5 === 0 || i === debtors.length - 1) {
            await notifyAdminProgress(
              client,
              'Enviando Cobranças',
              i + 1,
              debtors.length,
              {
                name: playerName,
                status: `✅ Enviado (${sent} enviados, ${skipped} pulados)`
              }
            );
          }
          
          await delay(8000);
        } else {
          skipped++;
        }
      } catch (error) {
        errors++;
        console.error(`❌ Erro ao enviar para ${playerName}:`, error.message);
        
        await notifyAdminProgress(
          client,
          'Enviando Cobranças',
          i + 1,
          debtors.length,
          {
            name: playerName,
            status: `❌ Erro`,
            error: error.message
          }
        );
      }
    }

    // Notificar admins do resultado final
    await delay(2000);
    await notifyAdmins(
      client,
      `✅ *Envio de Cobranças Concluído*\n\n` +
      `📊 Resumo:\n` +
      `• Enviadas: ${sent}\n` +
      `• Puladas: ${skipped}\n` +
      `• Erros: ${errors}\n` +
      `• Total: ${debtors.length}`,
      0
    );
    
  } else {
    await client.sendText(messsage.from, 'Somente admins, podem disparar mensagem de cobrança');
  }
}

module.exports = notifyDebtors;