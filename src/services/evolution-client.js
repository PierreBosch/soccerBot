const axios = require('axios');

class EvolutionClient {
  constructor() {
    this.apiUrl = process.env.EVOLUTION_API_URL || 'https://ameixa-evolution-api.h5zms9.easypanel.host';
    this.apiKey = process.env.EVOLUTION_API_KEY;
    this.instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'ameixa';
    
    if (!this.apiKey) {
      throw new Error('EVOLUTION_API_KEY não está configurada!');
    }

    this.client = axios.create({
      baseURL: `${this.apiUrl}/message`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.apiKey
      }
    });
  }

  /**
   * Envia mensagem de texto
   * @param {string} to - Número do destinatário (formato: 5548999999999@s.whatsapp.net ou 120363144278270676@g.us)
   * @param {string} message - Texto da mensagem
   */
  async sendText(to, message) {
    try {
      const response = await this.client.post('/sendText/' + this.instanceName, {
        number: to,
        text: message
      });
      
      console.log('✅ Mensagem enviada:', { to, preview: message.substring(0, 50) });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Envia áudio em base64
   * @param {string} to - Número do destinatário
   * @param {string} audioBase64 - Áudio em base64 (com ou sem prefixo data:audio/...)
   */
  async sendAudio(to, audioBase64) {
    try {
      // Remover prefixo data:audio/... se existir
      const cleanBase64 = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
      
      const response = await this.client.post('/sendWhatsAppAudio/' + this.instanceName, {
        number: to,
        audioMessage: {
          audio: cleanBase64
        },
        options: {
          delay: 1000,
          presence: 'recording',
          encoding: true // Indica que é base64
        }
      });
      
      console.log('✅ Áudio enviado:', { to });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao enviar áudio:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Envia arquivo de áudio
   * @param {string} to - Número do destinatário
   * @param {string} audioPathOrBase64 - Caminho do arquivo de áudio OU base64 string
   */
  async sendFile(to, audioPathOrBase64, options = {}) {
    try {
      // Verificar se é base64 (começa com data:audio ou é uma string longa sem /)
      const isBase64 = audioPathOrBase64.startsWith('data:audio') || 
                       (!audioPathOrBase64.includes('/') && audioPathOrBase64.length > 100);
      
      if (isBase64) {
        // Já é base64, enviar diretamente
        console.log('📤 Enviando áudio em base64');
        return await this.sendAudio(to, audioPathOrBase64);
      } else {
        // É caminho de arquivo, ler e converter
        console.log('📤 Lendo arquivo de áudio:', audioPathOrBase64);
        const fs = require('fs');
        const audioBase64 = fs.readFileSync(audioPathOrBase64, 'base64');
        
        return await this.sendAudio(to, audioBase64);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar arquivo:', error.message);
      throw error;
    }
  }

  /**
   * Envia mensagem com lista interativa
   * @param {string} to - Número do destinatário
   * @param {object} options - Opções da lista
   */
  async sendListMessage(to, options) {
    try {
      const response = await this.client.post('/sendList/' + this.instanceName, {
        number: to,
        title: options.title || 'Selecione uma opção',
        description: options.description || '',
        buttonText: options.buttonText || 'Ver opções',
        footerText: options.footerText || '',
        sections: options.sections || []
      });
      
      console.log('✅ Lista enviada:', { to, title: options.title });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao enviar lista:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cria enquete (poll)
   * @param {string} to - Número do destinatário
   * @param {string} name - Nome da enquete
   * @param {array} options - Opções da enquete
   */
  async sendPoll(to, name, options) {
    try {
      const response = await this.client.post('/sendPoll/' + this.instanceName, {
        number: to,
        name: name,
        selectableCount: 1,
        values: options
      });
      
      console.log('✅ Enquete enviada:', { to, name });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao enviar enquete:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Método auxiliar para compatibilidade com wppconnect
   * Converte número do formato Evolution para wppconnect se necessário
   */
  normalizeNumber(number) {
    // Se já está no formato correto, retorna
    if (number.includes('@')) {
      return number;
    }
    
    // Adiciona sufixo apropriado
    return number.includes('-') ? `${number}@g.us` : `${number}@s.whatsapp.net`;
  }

  /**
   * Método para compatibilidade - onMessage não é usado com webhooks
   * Mas mantemos para não quebrar a interface
   */
  onMessage(callback) {
    console.log('⚠️  onMessage não é usado com Evolution API (usa webhooks)');
    this._messageCallback = callback;
  }

  /**
   * Processa mensagem recebida via webhook
   */
  async processWebhookMessage(message) {
    if (this._messageCallback) {
      await this._messageCallback(message);
    }
  }
}

module.exports = EvolutionClient;

