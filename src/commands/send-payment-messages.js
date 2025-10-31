const getBillingPhones = require("../http/get-billing-phones");
const isAdmin = require("../permissions");
const getBillingTemplate = require("../templates/get-billing-template");
const delay = require("../util/delay");
const getPlayerName = require('../util/extract-first-and-last-name');
const { notifyAdmins, notifyAdminProgress } = require('../util/notify-admins');

async function sendPaymentMessages(message, client) {
  const senderId = message.sender.id;

  if(isAdmin(senderId)) {
    const billingPhones = await getBillingPhones()
    const billingTemplate = getBillingTemplate();

    // Notificar admins do início
    await notifyAdmins(
      client,
      `🚀 *Iniciando Envio de Mensagens de Pagamento*\n\n` +
      `Total de destinatários: ${billingPhones.length}\n` +
      `Delay entre mensagens: 8s\n\n` +
      `Aguarde...`,
      2000
    );

    let sent = 0;
    let errors = 0;

    // Usar for...of ao invés de map para garantir execução sequencial
    for (let i = 0; i < billingPhones.length; i++) {
      const billing = billingPhones[i];
      
      // Validar se billing tem dados necessários
      if (!billing || !billing.name || !billing.phone) {
        console.error(`⚠️ Billing ${i + 1} sem dados:`, billing);
        errors++;
        continue;
      }
      
      const playerName = getPlayerName(billing.name, true);
      
      try {
        await client.sendText(
          billing.phone, 
          billingTemplate.replace(/{nome}/g, playerName)
        );
        sent++;
        
        // Notificar progresso a cada 5 mensagens ou na última
        if (sent % 5 === 0 || i === billingPhones.length - 1) {
          await notifyAdminProgress(
            client,
            'Enviando Mensagens de Pagamento',
            i + 1,
            billingPhones.length,
            {
              name: playerName,
              status: `✅ Enviado (${sent}/${billingPhones.length})`
            }
          );
        }
        
        await delay(8000);
      } catch (error) {
        errors++;
        console.error(`❌ Erro ao enviar para ${playerName}:`, error.message);
        
        await notifyAdminProgress(
          client,
          'Enviando Mensagens de Pagamento',
          i + 1,
          billingPhones.length,
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
      `✅ *Envio de Mensagens Concluído*\n\n` +
      `📊 Resumo:\n` +
      `• Enviadas: ${sent}\n` +
      `• Erros: ${errors}\n` +
      `• Total: ${billingPhones.length}`,
      0
    );
    
  } else {
    await client.sendText(messsage.from, 'Somente admins, podem disparar mensagem de cobrança');
  }
}

module.exports = sendPaymentMessages;