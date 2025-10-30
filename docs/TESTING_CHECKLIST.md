# Checklist de Testes - Evolution API Migration

## 📋 Pré-requisitos

- [ ] Evolution API configurada e rodando
- [ ] API Key da Evolution API obtida
- [ ] Nome da instância anotado
- [ ] Instância conectada ao WhatsApp

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

**Verificar:**
- [ ] `express` instalado
- [ ] `body-parser` instalado
- [ ] `@wppconnect-team/wppconnect` removido

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

**Editar `.env` com:**
```env
EVOLUTION_API_URL=https://ameixa-evolution-api.h5zms9.easypanel.host
EVOLUTION_API_KEY=35e8bc3c-a2d5-4e6e-8ef1-7da74663c7ba
EVOLUTION_INSTANCE_NAME=ameixa
WEBHOOK_URL=https://seu-dominio.com/webhook/evolution
OPENAI_API_KEY=sk-proj-sua-chave
PORT=3000
```

**Verificar:**
- [ ] Todas as variáveis preenchidas
- [ ] API Key válida
- [ ] Nome da instância correto

### 3. Configurar Webhook na Evolution API

**URL do Webhook:**
```
https://managamental-diuretically-princeton.ngrok-free.dev/api/webhook/evolution
```

**Configuração:**
- [ ] URL configurada
- [ ] Eventos: `messages.upsert` selecionado
- [ ] Webhook habilitado (Enabled: ✅)
- [ ] Webhook by Events habilitado (se disponível)

**Verificar configuração:**
```bash
curl -X GET https://ameixa-evolution-api.h5zms9.easypanel.host/webhook/find/ameixa \
  -H "apikey: 35e8bc3c-a2d5-4e6e-8ef1-7da74663c7ba"
```

## 🚀 Testes Locais (com ngrok)

### 1. Iniciar Serviços

```bash
# Terminal 1: JSON Server
npm run db

# Terminal 2: Bot
npm start

# Terminal 3: ngrok
ngrok http 3000
```

### 2. Atualizar Webhook

Copie a URL do ngrok (ex: `https://abc123.ngrok.io`) e configure na Evolution API:
```
https://abc123.ngrok.io/webhook/evolution
```

### 3. Testes Básicos

#### Health Check
```bash
curl http://localhost:3000/health
```

**Esperado:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "FuteBot Evolution API"
}
```

- [ ] Health check retorna 200
- [ ] JSON válido retornado

#### Teste de Envio
```bash
curl -X POST http://localhost:3000/test/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5548999999999@s.whatsapp.net",
    "message": "🤖 Teste do FuteBot!"
  }'
```

- [ ] Mensagem enviada com sucesso
- [ ] Mensagem recebida no WhatsApp

## 📱 Testes de Comandos

### Comandos de Futebol

#### /add
- [ ] Enviar `/add` no WhatsApp
- [ ] Bot responde confirmando adição
- [ ] Nome aparece na lista

#### /lista
- [ ] Enviar `/lista`
- [ ] Bot retorna lista formatada
- [ ] Jogadores e goleiros separados

#### /fora
- [ ] Enviar `/fora`
- [ ] Bot confirma remoção
- [ ] Nome removido da lista

#### /limpar
- [ ] Enviar `/limpar`
- [ ] Bot confirma limpeza
- [ ] Lista zerada

#### /goleiro
- [ ] Enviar `/goleiro`
- [ ] Bot adiciona como goleiro
- [ ] Aparece na seção de goleiros

#### /escalacao
- [ ] Enviar `/escalacao`
- [ ] Bot retorna times divididos
- [ ] Escalação balanceada

### Comandos de Churrasco

#### /add-churras
- [ ] Enviar `/add-churras`
- [ ] Bot confirma adição
- [ ] Nome na lista do churrasco

#### /add-churras-coca
- [ ] Enviar `/add-churras-coca`
- [ ] Bot confirma adição com coca
- [ ] Marcado corretamente

#### /lista-churras
- [ ] Enviar `/lista-churras`
- [ ] Bot retorna lista do churrasco
- [ ] Diferencia quem tem coca

#### /convidado-churras|João Silva
- [ ] Enviar comando com nome
- [ ] Bot confirma adição do convidado
- [ ] Convidado na lista

#### /fora-churras
- [ ] Enviar `/fora-churras`
- [ ] Bot confirma remoção
- [ ] Removido da lista

#### /limpar-churras
- [ ] Enviar `/limpar-churras`
- [ ] Bot confirma limpeza
- [ ] Lista do churrasco zerada

### Comandos Financeiros

#### /serasa
- [ ] Enviar `/serasa`
- [ ] Bot gera lista de devedores
- [ ] Valores corretos calculados
- [ ] Participantes só do churrasco incluídos

#### /pago|Nome do Devedor
- [ ] Enviar comando com nome
- [ ] Bot confirma pagamento
- [ ] Status atualizado

#### /notificar
- [ ] Enviar `/notificar` (admin)
- [ ] Bot envia mensagens aos devedores
- [ ] Mensagens recebidas

#### /limpar-serasa
- [ ] Enviar `/limpar-serasa`
- [ ] Bot confirma limpeza
- [ ] Lista de devedores zerada

### Comandos de Informação

#### /pix
- [ ] Enviar `/pix`
- [ ] Bot retorna chave PIX
- [ ] Informações corretas

#### /jogo
- [ ] Enviar `/jogo`
- [ ] Bot retorna preço do jogo
- [ ] Valor correto

#### /churrasco
- [ ] Enviar `/churrasco`
- [ ] Bot retorna preço do churrasco
- [ ] Valor correto

#### /coca
- [ ] Enviar `/coca`
- [ ] Bot retorna preço da coca
- [ ] Valor correto

#### /cardapio
- [ ] Enviar `/cardapio`
- [ ] Bot retorna cardápio completo
- [ ] Formatação correta

#### /ajuda
- [ ] Enviar `/ajuda`
- [ ] Bot lista todos os comandos
- [ ] Descrições claras

### Comandos de Grupos

#### /configurar
- [ ] Enviar `/configurar` (admin)
- [ ] Bot configura grupo
- [ ] Confirmação recebida

#### /vou
- [ ] Enviar `/vou`
- [ ] Bot confirma presença
- [ ] Nome adicionado à lista

#### /naovou
- [ ] Enviar `/naovou`
- [ ] Bot cancela presença
- [ ] Nome removido da lista

#### /quemvai
- [ ] Enviar `/quemvai`
- [ ] Bot lista confirmados
- [ ] Lista correta

### Integração OpenAI

#### Menção ao Bot
- [ ] Mencionar bot no grupo
- [ ] Bot responde com IA
- [ ] Resposta contextual

#### Comando via IA
- [ ] Pedir "me adiciona na lista" via menção
- [ ] Bot identifica comando
- [ ] Executa ação correta

### Comandos Especiais

#### /mvp
- [ ] Enviar `/mvp` (admin)
- [ ] Bot cria enquete
- [ ] Enquete com jogadores da lista

#### /placar
- [ ] Enviar `/placar` (se configurado)
- [ ] Bot atualiza placar
- [ ] Informação correta

## 🔍 Testes de Webhook

### Recebimento de Mensagens

#### Mensagem de Texto
- [ ] Enviar mensagem de texto
- [ ] Webhook recebido
- [ ] Logs mostram mensagem adaptada
- [ ] Comando processado

#### Mensagem de Grupo
- [ ] Enviar mensagem em grupo
- [ ] Webhook recebido
- [ ] Identificado como grupo
- [ ] Processado corretamente

#### Mensagem com Menção
- [ ] Mencionar bot
- [ ] Webhook recebido
- [ ] Menções identificadas
- [ ] OpenAI ativada

#### Lista Interativa
- [ ] Enviar lista interativa
- [ ] Resposta processada
- [ ] Opção selecionada identificada

### Logs

- [ ] Logs mostram webhook recebido
- [ ] Logs mostram mensagem adaptada
- [ ] Logs mostram comando executado
- [ ] Logs mostram resposta enviada

## 🐳 Testes Docker

### Build
```bash
docker-compose build
```

- [ ] Build sem erros
- [ ] Imagem criada
- [ ] Tamanho reduzido (~500MB menor)

### Run
```bash
docker-compose up -d
```

- [ ] Containers iniciam
- [ ] Logs sem erros
- [ ] Health check OK

### Volumes
```bash
docker-compose exec soccerbot ls -la /usr/src/app/
```

- [ ] `db.json` existe
- [ ] `.env` montado (read-only)
- [ ] `tokens/` NÃO existe (removido)
- [ ] `out.png` NÃO existe (removido)

### Logs
```bash
docker-compose logs -f
```

- [ ] JSON Server inicia
- [ ] Bot aguarda JSON Server
- [ ] Bot conecta com sucesso
- [ ] Servidor Express rodando

## 🚀 Deploy em Produção

### EasyPanel

#### Configuração
- [ ] Variáveis de ambiente configuradas
- [ ] Portas 3000 e 3001 expostas
- [ ] Volume `db` configurado
- [ ] Volume `env` configurado (read-only)
- [ ] Volume `tokens` REMOVIDO

#### Deploy
- [ ] Deploy sem erros
- [ ] Containers rodando
- [ ] Health check acessível
- [ ] Logs sem erros

#### Webhook
- [ ] Webhook configurado com URL pública
- [ ] Eventos `messages.upsert` selecionados
- [ ] Webhook habilitado
- [ ] Testes de mensagem OK

### PM2

#### Iniciar
```bash
pm2 start ecosystem.config.js
```

- [ ] Processos iniciados
- [ ] `futebot-start` rodando
- [ ] `futebot-db` rodando
- [ ] Sem erros nos logs

#### Variáveis de Ambiente
```bash
pm2 env 0
```

- [ ] `EVOLUTION_API_URL` presente
- [ ] `EVOLUTION_API_KEY` presente
- [ ] `EVOLUTION_INSTANCE_NAME` presente
- [ ] `OPENAI_API_KEY` presente

#### Logs
```bash
pm2 logs futebot-start
```

- [ ] Servidor iniciado
- [ ] JSON Server conectado
- [ ] Cliente Evolution inicializado
- [ ] Webhook endpoint ativo

## ✅ Checklist Final

### Funcionalidade
- [ ] Todos os comandos funcionando
- [ ] Webhooks recebendo mensagens
- [ ] Respostas sendo enviadas
- [ ] OpenAI integrada
- [ ] Listas interativas funcionando
- [ ] Enquetes funcionando

### Performance
- [ ] Respostas rápidas (<2s)
- [ ] Sem memory leaks
- [ ] CPU estável
- [ ] Logs sem erros

### Segurança
- [ ] `.env` não commitado
- [ ] API Keys seguras
- [ ] Webhook HTTPS
- [ ] Permissões corretas

### Documentação
- [ ] README atualizado
- [ ] Guia de migração completo
- [ ] Troubleshooting documentado
- [ ] Exemplos funcionando

## 🎯 Critérios de Aprovação

Para fazer merge da branch `feature/evolution-api` para `main`:

1. ✅ Todos os comandos testados e funcionando
2. ✅ Webhooks recebendo e processando mensagens
3. ✅ Respostas sendo enviadas corretamente
4. ✅ Deploy em produção funcionando
5. ✅ Documentação completa
6. ✅ Sem erros críticos nos logs
7. ✅ Performance aceitável

## 📝 Notas de Teste

### Ambiente de Teste
- Data: _______________
- Testador: _______________
- Ambiente: [ ] Local [ ] Docker [ ] EasyPanel [ ] PM2

### Problemas Encontrados
```
1. 
2. 
3. 
```

### Observações
```


```

---

**Status**: ⏳ Aguardando Testes  
**Branch**: `feature/evolution-api`  
**Última Atualização**: 30 de Outubro de 2025

