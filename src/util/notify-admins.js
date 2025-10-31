const delay = require('./delay');

/**
 * Obtém lista de números de administradores
 * @returns {Array<string>} Lista de números de admin
 */
function getAdminNumbers() {
  const defaultAdmins = [
    "554896742125@c.us",
    "554896106006@c.us",
    "554899423230@c.us",
    "251917179551812@lid"
  ];

  const admins = process.env.ADMIN_NUMBERS 
    ? process.env.ADMIN_NUMBERS.split(',').map(num => num.trim())
    : defaultAdmins;

  return admins;
}

/**
 * Normaliza número para formato WhatsApp
 * @param {string} number - Número a ser normalizado
 * @returns {string} Número normalizado
 */
function normalizeAdminNumber(number) {
  // Se já tem sufixo, retorna como está
  if (number.includes('@')) {
    return number;
  }
  
  // Adiciona sufixo padrão
  return `${number}@s.whatsapp.net`;
}

/**
 * Envia mensagem para todos os admins com delay
 * @param {Object} client - Cliente do WhatsApp
 * @param {string} message - Mensagem a ser enviada
 * @param {number} delayMs - Delay entre mensagens em ms (padrão: 2000)
 */
async function notifyAdmins(client, message, delayMs = 2000) {
  const admins = getAdminNumbers();
  
  console.log('📢 Enviando notificação para admins:', {
    adminsCount: admins.length,
    message: message.substring(0, 100)
  });

  for (const admin of admins) {
    try {
      const normalizedNumber = normalizeAdminNumber(admin);
      
      console.log('📤 Enviando para admin:', normalizedNumber);
      await client.sendText(normalizedNumber, message);
      
      // Delay entre mensagens
      if (delayMs > 0) {
        await delay(delayMs);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar para admin:', admin, error.message);
    }
  }
  
  console.log('✅ Notificações enviadas para todos os admins');
}

/**
 * Envia log de progresso para admins
 * @param {Object} client - Cliente do WhatsApp
 * @param {string} action - Ação sendo executada
 * @param {number} current - Progresso atual
 * @param {number} total - Total de itens
 * @param {Object} details - Detalhes adicionais
 */
async function notifyAdminProgress(client, action, current, total, details = {}) {
  const percentage = Math.round((current / total) * 100);
  const message = `🤖 *${action}*\n\n` +
                  `Progresso: ${current}/${total} (${percentage}%)\n` +
                  (details.name ? `Atual: ${details.name}\n` : '') +
                  (details.status ? `Status: ${details.status}\n` : '') +
                  (details.error ? `⚠️ Erro: ${details.error}\n` : '');
  
  await notifyAdmins(client, message, 0); // Sem delay para logs de progresso
}

module.exports = {
  notifyAdmins,
  notifyAdminProgress,
  getAdminNumbers,
  normalizeAdminNumber
};

