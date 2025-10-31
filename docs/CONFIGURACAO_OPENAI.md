# 🤖 Configuração da OpenAI

## Problema Resolvido

A integração com a OpenAI foi atualizada para funcionar corretamente com a versão 5.x da biblioteca.

## Mudanças Implementadas

### 1. ✅ Migração para Nova API `tools`
- Atualizado de `functions` (depreciado) para `tools`
- Atualizado de `function_call` para `tool_calls`

### 2. ✅ Tratamento de Erros Robusto
- Adicionado `.catch()` para capturar erros da API
- Mensagens de erro específicas para diferentes cenários
- Logs detalhados para facilitar debug

### 3. ✅ Validação de Chave da API
- Verifica se `OPENAI_API_KEY` está configurada antes de usar
- Mensagem amigável se a chave estiver faltando

### 4. ✅ Suporte a Variáveis de Ambiente
- Instalado pacote `dotenv`
- Configurado `ecosystem.config.js` para carregar `.env`
- Criado `.env.example` como referência

## Como Configurar

### Passo 1: Obter Chave da API

1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-proj-...`)

### Passo 2: Configurar o Arquivo .env

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e adicione sua chave
nano .env
```

Substitua o valor de `OPENAI_API_KEY` pela sua chave real:

```
OPENAI_API_KEY=sk-proj-sua-chave-real-aqui
```

### Passo 3: Reiniciar o Bot

```bash
# Se estiver usando PM2
pm2 restart futebot-start

# Ou se estiver rodando diretamente
npm run start
```

## Testando

Para testar se está funcionando:

1. Mencione o bot no grupo do WhatsApp
2. Envie uma mensagem como: `@bot qual é a escalação?`
3. O bot deve responder normalmente

## Erros Comuns

### Erro: "OPENAI_API_KEY não está configurada"
**Solução:** Crie o arquivo `.env` e adicione sua chave

### Erro: "Erro de autenticação com a OpenAI"
**Solução:** Verifique se a chave está correta e não expirou

### Erro: "Muitas requisições"
**Solução:** Aguarde alguns minutos, você atingiu o limite de rate

### Erro: "Sem conexão com a OpenAI"
**Solução:** Verifique sua conexão com a internet

## Logs

Para ver os logs e debug:

```bash
# Ver logs do PM2
pm2 logs futebot-start

# Ver logs em tempo real
pm2 logs futebot-start --lines 100
```

## Segurança

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env` no git
- Nunca compartilhe sua chave da API publicamente
- O `.env` já está no `.gitignore`

## Suporte

Se continuar com problemas, verifique:
1. A chave da API está ativa no painel da OpenAI
2. Você tem créditos disponíveis na conta
3. Os logs do PM2 para ver erros específicos
