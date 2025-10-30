const isAdmin = require('../permissions');

function timePeriodNotAllowedError(mensagem) {
  const erro = new Error(mensagem);
  erro.name = "TimePeriodNotAllowedError";
  throw erro;
}

function isInAllowedPeriod(fn) {
  return async function(...args) {
    const [message, client] = args;
    const senderId = message.sender.id;

    // Admins podem adicionar jogadores a qualquer momento
    if (isAdmin(senderId)) {
      return fn(...args);
    }

    const now = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    const weekDay = now.getDay(); 
    const hour = now.getHours();

    if ((weekDay === 3 && hour >= 19) || 
        (weekDay >= 4 && weekDay <= 6) || 
        (weekDay === 0 && hour < 20)) {
      return await client.sendText(message.from, "Operação não permitida! Você só pode adicionar nomes entre domingo 20h e quarta-feira até antes das 19h.");
    }
  
    return fn(...args);
  };
}

module.exports = isInAllowedPeriod