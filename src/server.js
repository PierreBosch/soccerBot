"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const EvolutionClient = require('./services/evolution-client');
const { adaptEvolutionMessage, isValidWebhook } = require('./adapters/message-adapter');

// Carregar variáveis de ambiente
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cliente Evolution API
let evolutionClient;

// URL do JSON Server (dinâmica para Docker ou local)
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

// Função para processar mensagens recebidas
async function processMessage(message, client) {
    try {
        // Importar módulos necessários dinamicamente
        const onGroupMention = require('./middlewares/on-group-mention');
        const addBarbecueEater = require('./commands/add-barbecue-eater');
        
        // Ativar/Desativar placar (mantido do start original)
        if (message.body && message.body.toLowerCase() === 'ativar placar') {
            console.log('Comando ativar placar recebido');
            await client.sendText(message.from, 'Atualização automática do placar ATIVADA!');
            return;
        }

        if (message.body && message.body.toLowerCase() === 'desativar placar') {
            console.log('Comando desativar placar recebido');
            await client.sendText(message.from, 'Atualização automática do placar DESATIVADA!');
            return;
        }

        // Processar lista interativa
        if (message.type === 'list_response' && message.listResponse) {
            const selectedRowId = message.listResponse.singleSelectReply?.selectedRowId;
            console.log('Lista selecionada:', selectedRowId);
            
            switch (selectedRowId) {
                case 'add-churras-coca':
                    await addBarbecueEater({...message, body: '/add-churras-coca'}, client);
                    break;
                case 'add-churras':
                    await addBarbecueEater({...message, body: '/add-churras'}, client);
                    break;
                default:
                    break;
            }
            return;
        }

        // Processar menções no grupo
        await onGroupMention(client, message);

        // Processar comandos que começam com /
        if (message.body) {
            const [command] = message.body.toLowerCase().split(' ');
            
            if (command.trim().startsWith('/')) {
                const commandsModule = require('./commands/index.js');
                
                // Usar a função executeCommand exportada pelo módulo
                if (typeof commandsModule === 'function') {
                    // Se exporta a função start, não usamos mais (webhook mode)
                    console.log('⚠️ Modo legado detectado');
                } else if (commandsModule.executeCommand) {
                    // Usar executeCommand se existir
                    await commandsModule.executeCommand(command, message, client);
                } else {
                    console.error(`❌ executeCommand não encontrado no módulo commands`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
    }
}

// Função para aguardar o JSON Server estar pronto
async function waitForJSONServer() {
    const maxRetries = 30;
    let retries = 0;
    
    console.log(`🔍 Aguardando JSON Server iniciar em ${JSON_SERVER_URL}...`);
    
    while (retries < maxRetries) {
        try {
            await axios.get(JSON_SERVER_URL);
            console.log('✅ JSON Server conectado com sucesso!');
            return true;
        } catch (error) {
            retries++;
            if (retries % 5 === 0) {
                console.log(`⏳ Aguardando JSON Server... (${retries}/${maxRetries})`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    throw new Error(`❌ JSON Server não iniciou a tempo em ${JSON_SERVER_URL}! Verifique se o serviço está rodando.`);
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'FuteBot Evolution API'
    });
});

// Endpoint para receber webhooks da Evolution API
app.post('/webhook/evolution', async (req, res) => {
    try {
        const webhookData = req.body;
        
        console.log('📨 Webhook recebido:', JSON.stringify(webhookData, null, 2));
        
        // Validar se é um webhook válido
        if (!isValidWebhook(webhookData)) {
            console.log('⚠️  Webhook ignorado - tipo não suportado:', webhookData.event);
            return res.status(200).json({ message: 'Webhook type not supported' });
        }
        
        // Adaptar mensagem para formato wppconnect
        const adaptedMessage = adaptEvolutionMessage(webhookData);
        
        if (!adaptedMessage) {
            console.log('⚠️  Mensagem ignorada - dados inválidos ou mensagem própria');
            return res.status(200).json({ message: 'Message ignored' });
        }
        
        console.log('✅ Mensagem adaptada:', {
            from: adaptedMessage.from,
            body: adaptedMessage.body,
            type: adaptedMessage.type,
            isGroup: adaptedMessage.isGroupMsg
        });
        
        // Processar mensagem através do sistema de comandos
        if (evolutionClient) {
            await processMessage(adaptedMessage, evolutionClient);
        } else {
            console.error('❌ Cliente Evolution não inicializado!');
        }
        
        // Responder rapidamente ao webhook
        res.status(200).json({ 
            success: true, 
            message: 'Webhook processed' 
        });
        
    } catch (error) {
        console.error('❌ Erro ao processar webhook:', error);
        // Sempre retornar 200 para não fazer a Evolution API reenviar
        res.status(200).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Endpoint de teste para enviar mensagem
app.post('/test/send', async (req, res) => {
    try {
        const { to, message } = req.body;
        
        if (!to || !message) {
            return res.status(400).json({ error: 'Parâmetros "to" e "message" são obrigatórios' });
        }
        
        const result = await evolutionClient.sendText(to, message);
        res.json({ success: true, result });
        
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem de teste:', error);
        res.status(500).json({ error: error.message });
    }
});

// Inicializar servidor
async function initializeServer() {
    try {
        console.log('🚀 Iniciando FuteBot com Evolution API...');
        
        // Aguardar JSON Server
        await waitForJSONServer();
        
        // Inicializar cliente Evolution API
        evolutionClient = new EvolutionClient();
        console.log('✅ Cliente Evolution API inicializado');
        
        // Com Evolution API, não precisamos registrar onMessage
        // As mensagens chegam via webhook
        
        // Iniciar servidor HTTP
        app.listen(PORT, () => {
            console.log(`✅ Servidor rodando na porta ${PORT}`);
            console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook/evolution`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
            console.log('');
            console.log('🤖 FuteBot pronto para receber mensagens!');
            console.log('');
            console.log('📋 Configuração do Webhook na Evolution API:');
            console.log(`   URL: ${process.env.WEBHOOK_URL || 'https://seu-dominio.com/webhook/evolution'}`);
            console.log('   Eventos: messages.upsert');
            console.log('   Enabled: true');
        });
        
    } catch (error) {
        console.error('❌ Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Iniciar
initializeServer();

