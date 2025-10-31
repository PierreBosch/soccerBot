# 👥 Configuração de Administradores

Este documento explica como configurar os administradores do FuteBot.

---

## 📋 O que são Administradores?

Administradores têm permissões especiais no bot, incluindo:

- ✅ Criar e deletar listas de jogadores
- ✅ Criar e deletar listas de churrasco
- ✅ Gerenciar lista de devedores
- ✅ Enviar mensagens de cobrança
- ✅ Adicionar jogadores fora do período permitido
- ✅ Limpar dívidas
- ✅ Enviar convites

---

## ⚙️ Como Configurar

### **Opção 1: Variável de Ambiente (Recomendado)**

Adicione a variável `ADMIN_NUMBERS` no seu arquivo `.env`:

```bash
ADMIN_NUMBERS=554896742125@c.us,554896106006@c.us,554899423230@c.us
```

#### **Formatos Aceitos:**

Você pode usar qualquer um destes formatos:

```bash
# Com sufixo @c.us (formato antigo do WhatsApp)
ADMIN_NUMBERS=554896742125@c.us,554896106006@c.us

# Com sufixo @s.whatsapp.net (formato atual)
ADMIN_NUMBERS=554896742125@s.whatsapp.net,554896106006@s.whatsapp.net

# Com sufixo @lid (formato de algumas contas)
ADMIN_NUMBERS=251917179551812@lid

# Sem sufixo (será normalizado automaticamente)
ADMIN_NUMBERS=554896742125,554896106006,554899423230

# Misturado (funciona!)
ADMIN_NUMBERS=554896742125@c.us,554896106006,251917179551812@lid
```

---

### **Opção 2: Valores Padrão (Fallback)**

Se você **não** configurar a variável `ADMIN_NUMBERS`, o bot usará os valores padrão definidos em `src/permissions/index.js`:

```javascript
const defaultAdmins = [
  "554896742125@c.us",
  "554896106006@c.us",
  "554899423230@c.us",
  "251917179551812@lid"
];
```

---

## 🔍 Como Descobrir o ID do WhatsApp

Para adicionar um novo administrador, você precisa do ID correto do WhatsApp.

### **Método 1: Logs do Bot**

1. Peça para a pessoa enviar qualquer mensagem para o bot
2. Verifique os logs do servidor
3. Procure por linhas como:
   ```
   📨 Webhook recebido: {
     "sender": "554896742125@s.whatsapp.net"
   }
   ```

### **Método 2: Webhook da Evolution API**

Quando alguém envia uma mensagem, o webhook mostra:

```json
{
  "data": {
    "key": {
      "remoteJid": "554896742125@s.whatsapp.net"
    }
  }
}
```

O `remoteJid` é o ID que você precisa.

---

## 🚀 Aplicar Alterações

### **Em Desenvolvimento Local:**

1. Edite o arquivo `.env`
2. Adicione/modifique `ADMIN_NUMBERS`
3. Reinicie o servidor:
   ```bash
   npm run dev
   ```

### **Em Produção (EasyPanel):**

1. Acesse o painel do EasyPanel
2. Vá em **Environment Variables**
3. Adicione/edite a variável `ADMIN_NUMBERS`
4. Clique em **Deploy**

---

## ✅ Verificar Configuração

Ao iniciar o bot, você verá nos logs:

```
👥 Administradores configurados: 4
```

Isso confirma quantos administradores foram carregados.

---

## 🔒 Segurança

### **Boas Práticas:**

- ✅ **Use variável de ambiente** ao invés de hardcoded
- ✅ **Nunca commite** o arquivo `.env` no git
- ✅ **Revise periodicamente** a lista de admins
- ✅ **Remova** admins que não precisam mais de acesso

### **Atenção:**

- ⚠️ Administradores têm **acesso total** ao bot
- ⚠️ Podem **deletar listas** e **enviar mensagens** para todos
- ⚠️ Escolha apenas pessoas de **confiança**

---

## 🐛 Troubleshooting

### **Problema: Admin não reconhecido**

**Possíveis causas:**

1. **Formato incorreto do número**
   - Solução: Verifique o formato no webhook/logs
   
2. **Variável de ambiente não carregada**
   - Solução: Reinicie o servidor após editar `.env`
   
3. **Número com sufixo diferente**
   - Solução: O sistema normaliza automaticamente, mas verifique os logs

### **Problema: Nenhum admin configurado**

Se você ver `👥 Administradores configurados: 0`, significa que:

- A variável `ADMIN_NUMBERS` está vazia
- Os valores padrão foram removidos

**Solução:** Configure pelo menos um admin no `.env`

---

## 📝 Exemplo Completo

Arquivo `.env`:

```bash
# ... outras configurações ...

# Administradores do bot
ADMIN_NUMBERS=554896742125@c.us,554896106006@c.us,554899423230@c.us,251917179551812@lid
```

Arquivo `src/permissions/index.js` (não precisa editar):

```javascript
// Carrega automaticamente da variável de ambiente
const admins = process.env.ADMIN_NUMBERS 
  ? process.env.ADMIN_NUMBERS.split(',').map(num => num.trim())
  : defaultAdmins;
```

---

## 🎯 Comandos Restritos a Admins

Os seguintes comandos **só funcionam** para administradores:

- `/limpar` - Limpar lista de jogadores
- `/limpar-churras` - Limpar lista de churrasco
- `/deletar` - Deletar lista de jogadores
- `/deletar-churras` - Deletar lista de churrasco
- `/serasa` - Ver lista de devedores
- `/criar-serasa` - Criar lista de devedores
- `/deletar-serasa` - Deletar lista de devedores
- `/enviar-cobranca` - Enviar mensagens de cobrança
- `/notificar-devedores` - Notificar devedores
- `/limpar-divida` - Limpar dívida de alguém
- `/convidar-churras` - Enviar convites para churrasco
- `/enviar-convite` - Enviar convites para jogadores

Além disso, admins podem:
- Adicionar jogadores **fora do período permitido**
- Adicionar convidados na lista de churrasco

---

## 📚 Referências

- Arquivo de implementação: `src/permissions/index.js`
- Exemplo de uso: `src/middlewares/is-in-allowed-period.js`
- Documentação do .env: `.env.example`

