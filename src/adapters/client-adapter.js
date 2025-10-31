/**
 * ClientAdapter - Wrapper de compatibilidade entre wppconnect e Evolution API
 * 
 * Este adapter mantém a interface do wppconnect (usada em todos os comandos)
 * mas usa Evolution API por baixo dos panos.
 * 
 * Vantagens:
 * - Não precisa modificar nenhum comando existente
 * - Compatibilidade total com código legado
 * - Fácil manutenção e rollback
 */

class ClientAdapter {
  constructor(evolutionClient) {
    if (!evolutionClient) {
      throw new Error('EvolutionClient é obrigatório para o ClientAdapter');
    }
    this.evolutionClient = evolutionClient;
  }

  /**
   * Envia mensagem de texto
   * Interface compatível com wppconnect: client.sendText(to, message)
   */
  async sendText(to, message) {
    try {
      // Normalizar número se necessário
      const normalizedTo = this.evolutionClient.normalizeNumber(to);
      
      console.log('📤 ClientAdapter.sendText:', { to: normalizedTo, preview: message.substring(0, 50) });
      
      return await this.evolutionClient.sendText(normalizedTo, message);
    } catch (error) {
      console.error('❌ Erro no ClientAdapter.sendText:', error.message);
      throw error;
    }
  }

  /**
   * Envia arquivo (áudio, imagem, etc)
   * Interface compatível com wppconnect: client.sendFile(to, filePath, options)
   */
  async sendFile(to, filePath, options = {}) {
    try {
      const normalizedTo = this.evolutionClient.normalizeNumber(to);
      
      console.log('📤 ClientAdapter.sendFile:', { to: normalizedTo, filePath });
      
      return await this.evolutionClient.sendFile(normalizedTo, filePath, options);
    } catch (error) {
      console.error('❌ Erro no ClientAdapter.sendFile:', error.message);
      throw error;
    }
  }

  /**
   * Envia imagem
   * Interface compatível com wppconnect: client.sendImage(to, imageUrl)
   */
  async sendImage(to, imageUrl, options = {}) {
    try {
      const normalizedTo = this.evolutionClient.normalizeNumber(to);
      
      console.log('📤 ClientAdapter.sendImage:', { to: normalizedTo, imageUrl });
      
      // Evolution API usa sendFile para imagens também
      return await this.evolutionClient.sendFile(normalizedTo, imageUrl, options);
    } catch (error) {
      console.error('❌ Erro no ClientAdapter.sendImage:', error.message);
      throw error;
    }
  }

  /**
   * Envia áudio
   * Interface compatível com wppconnect: client.sendAudio(to, audioPath)
   */
  async sendAudio(to, audioPath) {
    try {
      const normalizedTo = this.evolutionClient.normalizeNumber(to);
      
      console.log('📤 ClientAdapter.sendAudio:', { to: normalizedTo, audioPath });
      
      return await this.evolutionClient.sendFile(normalizedTo, audioPath);
    } catch (error) {
      console.error('❌ Erro no ClientAdapter.sendAudio:', error.message);
      throw error;
    }
  }

  /**
   * Envia lista interativa
   * Interface compatível com wppconnect: client.sendListMessage(to, options)
   */
  async sendListMessage(to, options) {
    try {
      const normalizedTo = this.evolutionClient.normalizeNumber(to);
      
      console.log('📤 ClientAdapter.sendListMessage:', { to: normalizedTo, title: options.title });
      
      return await this.evolutionClient.sendListMessage(normalizedTo, options);
    } catch (error) {
      console.error('❌ Erro no ClientAdapter.sendListMessage:', error.message);
      throw error;
    }
  }

  /**
   * Envia enquete (poll)
   * Interface compatível com wppconnect: client.sendPoll(to, name, options)
   */
  async sendPoll(to, name, options) {
    try {
      const normalizedTo = this.evolutionClient.normalizeNumber(to);
      
      console.log('📤 ClientAdapter.sendPoll:', { to: normalizedTo, name });
      
      return await this.evolutionClient.sendPoll(normalizedTo, name, options);
    } catch (error) {
      console.error('❌ Erro no ClientAdapter.sendPoll:', error.message);
      throw error;
    }
  }

  /**
   * Método para compatibilidade - onMessage não é usado com webhooks
   * Mantido apenas para não quebrar a interface
   */
  onMessage(callback) {
    console.log('⚠️  ClientAdapter.onMessage: Este método não é usado com Evolution API (usa webhooks)');
    this._messageCallback = callback;
  }

  /**
   * Métodos auxiliares que podem ser necessários
   */
  
  // Normalizar número (delega para EvolutionClient)
  normalizeNumber(number) {
    return this.evolutionClient.normalizeNumber(number);
  }

  // Obter informações da instância
  getInstanceInfo() {
    return {
      apiUrl: this.evolutionClient.apiUrl,
      instanceName: this.evolutionClient.instanceName
    };
  }
}

module.exports = ClientAdapter;

