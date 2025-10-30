"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const start = require('./commands');
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
            await evolutionClient.processWebhookMessage(adaptedMessage);
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
        
        // Registrar callback de mensagens
        evolutionClient.onMessage(async (message) => {
            await start(evolutionClient)(message);
        });
        
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

