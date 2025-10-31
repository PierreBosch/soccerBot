/**
 * Adaptador para converter mensagens da Evolution API para o formato wppconnect
 */

/**
 * Extrai o corpo da mensagem de diferentes tipos
 */
function extractMessageBody(messageData) {
  const msg = messageData.message;
  
  if (!msg) return '';
  
  // Mensagem de texto simples
  if (msg.conversation) {
    return msg.conversation;
  }
  
  // Mensagem de texto estendida (com menção, reply, etc)
  if (msg.extendedTextMessage?.text) {
    return msg.extendedTextMessage.text;
  }
  
  // Mensagem de imagem com legenda
  if (msg.imageMessage?.caption) {
    return msg.imageMessage.caption;
  }
  
  // Mensagem de vídeo com legenda
  if (msg.videoMessage?.caption) {
    return msg.videoMessage.caption;
  }
  
  // Resposta de lista interativa
  if (msg.listResponseMessage) {
    return msg.listResponseMessage.singleSelectReply?.selectedRowId || '';
  }
  
  // Resposta de botão
  if (msg.buttonsResponseMessage) {
    return msg.buttonsResponseMessage.selectedButtonId || '';
  }
  
  return '';
}

/**
 * Determina o tipo da mensagem
 */
function getMessageType(messageData) {
  const msg = messageData.message;
  
  if (!msg) return 'chat';
  
  if (msg.conversation || msg.extendedTextMessage) return 'chat';
  if (msg.imageMessage) return 'image';
  if (msg.videoMessage) return 'video';
  if (msg.audioMessage) return 'audio';
  if (msg.documentMessage) return 'document';
  if (msg.stickerMessage) return 'sticker';
  if (msg.listResponseMessage) return 'list_response';
  if (msg.buttonsResponseMessage) return 'buttons_response';
  
  return 'unknown';
}

/**
 * Extrai lista de menções da mensagem
 */
function extractMentions(messageData) {
  const msg = messageData.message;
  
  if (msg?.extendedTextMessage?.contextInfo?.mentionedJid) {
    return msg.extendedTextMessage.contextInfo.mentionedJid;
  }
  
  return [];
}

/**
 * Verifica se é mensagem de grupo
 */
function isGroupMessage(remoteJid) {
  return remoteJid.includes('@g.us');
}

/**
 * Converte mensagem da Evolution API para formato wppconnect
 */
function adaptEvolutionMessage(webhookData) {
  const data = webhookData.data;
  
  if (!data || !data.key) {
    console.error('❌ Dados inválidos recebidos do webhook:', webhookData);
    return null;
  }
  
  const { key, message, pushName, messageTimestamp } = data;
  
  // Ignora mensagens enviadas pelo próprio bot
  if (key.fromMe) {
    return null;
  }
  
  const body = extractMessageBody(data);
  const type = getMessageType(data);
  const mentions = extractMentions(data);
  const isGroup = isGroupMessage(key.remoteJid);
  
  // Em grupos, o participant é o remetente real
  // Em conversas privadas, o remoteJid é o remetente
  const senderId = key.participant || key.remoteJid;
  
  console.log('📋 Adaptando mensagem:', {
    isGroup,
    remoteJid: key.remoteJid,
    participant: key.participant,
    senderId,
    body: body?.substring(0, 50)
  });
  
  // Formato compatível com wppconnect
  const adaptedMessage = {
    // Identificação
    id: key.id,
    from: key.remoteJid,
    to: key.remoteJid,
    
    // Remetente (compatibilidade com wppconnect)
    sender: {
      id: senderId,
      pushname: pushName || 'Desconhecido',
      name: pushName || 'Desconhecido'
    },
    
    // Author (para comandos que usam message.author)
    author: senderId,
    
    // Conteúdo
    body: body,
    type: type,
    
    // Contexto
    isGroupMsg: isGroup,
    chat: {
      id: key.remoteJid,
      name: pushName || ''
    },
    
    // Menções
    mentionedJidList: mentions,
    
    // Timestamp
    timestamp: messageTimestamp,
    t: messageTimestamp,
    
    // Dados originais para casos especiais
    _raw: data,
    
    // Para compatibilidade com respostas de lista
    listResponse: message?.listResponseMessage ? {
      singleSelectReply: {
        selectedRowId: message.listResponseMessage.singleSelectReply?.selectedRowId || ''
      }
    } : undefined
  };
  
  return adaptedMessage;
}

/**
 * Valida se o webhook é do tipo esperado
 */
function isValidWebhook(webhookData) {
  // Aceita tanto messages.upsert quanto message_upsert
  const validEvents = ['messages.upsert', 'message.upsert', 'messages_upsert'];
  
  if (!webhookData.event) {
    return false;
  }
  
  return validEvents.includes(webhookData.event.toLowerCase());
}

module.exports = {
  adaptEvolutionMessage,
  isValidWebhook,
  extractMessageBody,
  getMessageType,
  isGroupMessage
};

