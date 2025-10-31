require('dotenv').config();

/**
 * Lista de administradores do bot
 * Pode ser configurada via variável de ambiente ADMIN_NUMBERS
 * Formato: números separados por vírgula (com ou sem sufixo @c.us/@s.whatsapp.net/@lid)
 * 
 * Exemplo no .env:
 * ADMIN_NUMBERS=554896742125@c.us,554896106006@c.us,554899423230@c.us
 * ou
 * ADMIN_NUMBERS=554896742125,554896106006,554899423230
 */

// Admins padrão (fallback se não houver variável de ambiente)
const defaultAdmins = [
  "554896742125@c.us",
  "554896106006@c.us",
  "554899423230@c.us",
  "251917179551812@lid"
];

// Carregar admins da variável de ambiente ou usar padrão
const admins = process.env.ADMIN_NUMBERS 
  ? process.env.ADMIN_NUMBERS.split(',').map(num => num.trim())
  : defaultAdmins;

console.log('👥 Administradores configurados:', admins.length);

/**
 * Verifica se um número de telefone é administrador
 * @param {string} phoneId - ID do telefone (pode ter vários formatos)
 * @returns {boolean}
 */
function isAdmin(phoneId) {
  if (!phoneId) return false;
  
  // Normalizar o número para comparação
  const normalizedPhone = phoneId.replace(/@c\.us|@s\.whatsapp\.net|@g\.us/g, '');
  
  // Verificar se o número está na lista de admins (com ou sem sufixo)
  return admins.some(admin => {
    const normalizedAdmin = admin.replace(/@c\.us|@s\.whatsapp\.net|@lid|@g\.us/g, '');
    return normalizedPhone === normalizedAdmin || phoneId === admin;
  });
}

module.exports = isAdmin;