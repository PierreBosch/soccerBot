# 🔍 Debug - Problema de Permissão de Admin

## 🐛 Problema Relatado

Ao enviar `/serasa` em grupo, continua recebendo mensagem de "não é admin", mesmo após as correções.

---

## 📋 Checklist de Verificação

### **1. Deploy Realizado?**
- [ ] Fez deploy da última versão no EasyPanel?
- [ ] Branch `feature/evolution-api` está atualizada?
- [ ] Container reiniciou após o deploy?

### **2. Variável de Ambiente Configurada?**
- [ ] `ADMIN_NUMBERS` está configurada no EasyPanel?
- [ ] Formato correto: `554896742125,554896106006,554899423230`
- [ ] Sem espaços extras ou caracteres especiais?

### **3. Logs Estão Aparecendo?**
- [ ] Logs de inicialização mostram admins configurados?
- [ ] Logs de verificação aparecem quando envia comando?

---

## 🔍 Como Debugar

### **Passo 1: Verificar Logs de Inicialização**

Ao iniciar o bot, você deve ver:

```
👥 Administradores configurados: {
  count: 4,
  source: 'ADMIN_NUMBERS env var',  // ou 'defaultAdmins'
  admins: [
    '554896742125',
    '554896106006',
    '554899423230',
    '251917179551812'
  ]
}
```

**O que verificar:**
- ✅ `source` deve ser `'ADMIN_NUMBERS env var'` (se configurou no EasyPanel)
- ✅ `admins` deve conter seu número
- ❌ Se `source` for `'defaultAdmins'`, a variável de ambiente não foi carregada

---

### **Passo 2: Enviar Comando em Grupo**

Envie `/serasa` no grupo e observe os logs:

```
📋 Adaptando mensagem: {
  isGroup: true,
  remoteJid: '120363144278270676@g.us',
  participant: '554896742125@s.whatsapp.net',
  senderId: '554896742125@s.whatsapp.net',
  body: '/serasa'
}

🔐 Verificando admin: {
  phoneId: '554896742125@s.whatsapp.net',
  normalizedPhone: '554896742125',
  adminsCount: 4
}

🔍 Comparando: {
  phoneId: '554896742125@s.whatsapp.net',
  normalizedPhone: '554896742125',
  admin: '554896742125@c.us',
  normalizedAdmin: '554896742125',
  match: true
}

✅ Admin encontrado: {
  phoneId: '554896742125@s.whatsapp.net',
  admin: '554896742125@c.us'
}
```

**O que verificar:**
- ✅ `participant` deve ser seu número
- ✅ `senderId` deve ser seu número
- ✅ `normalizedPhone` deve ser apenas o número (sem @...)
- ✅ `normalizedAdmin` deve ser apenas o número
- ✅ `match` deve ser `true`

---

### **Passo 3: Se Não Funcionar**

Se os logs mostrarem `match: false` para todos os admins:

```
🔍 Comparando: {
  phoneId: '554896742125@s.whatsapp.net',
  normalizedPhone: '554896742125',
  admin: '554896742125@c.us',
  normalizedAdmin: '554896742125',
  match: false  // ❌ Por que false?
}

❌ Não é admin: {
  phoneId: '554896742125@s.whatsapp.net',
  normalizedPhone: '554896742125',
  adminsChecked: 4
}
```

**Possíveis causas:**

1. **Número diferente no WhatsApp**
   - O número que aparece no `phoneId` é diferente do configurado
   - Solução: Copiar o número exato do log e adicionar em `ADMIN_NUMBERS`

2. **Caracteres invisíveis**
   - Espaços, quebras de linha, etc. na variável de ambiente
   - Solução: Reescrever `ADMIN_NUMBERS` sem copiar/colar

3. **Variável não carregada**
   - Container não reiniciou após adicionar variável
   - Solução: Fazer redeploy no EasyPanel

---

## 🛠️ Soluções

### **Solução 1: Verificar Variável de Ambiente**

No EasyPanel:

1. Vá em **Environment Variables**
2. Procure por `ADMIN_NUMBERS`
3. Verifique o valor:
   ```
   554896742125,554896106006,554899423230,251917179551812
   ```
4. **Sem espaços, sem aspas, sem @...**
5. Clique em **Save**
6. Clique em **Deploy**

---

### **Solução 2: Usar Número Exato dos Logs**

1. Envie qualquer mensagem no grupo
2. Copie o `participant` dos logs:
   ```
   participant: '554896742125@s.whatsapp.net'
   ```
3. Adicione EXATAMENTE esse número em `ADMIN_NUMBERS`:
   ```
   554896742125@s.whatsapp.net,554896106006,554899423230
   ```

---

### **Solução 3: Usar Apenas Números (Sem Sufixo)**

A normalização deveria funcionar, mas se não funcionar:

1. Configure `ADMIN_NUMBERS` apenas com números:
   ```
   554896742125,554896106006,554899423230
   ```
2. O código vai normalizar automaticamente

---

### **Solução 4: Adicionar Todos os Formatos**

Se nada funcionar, adicione o número em TODOS os formatos:

```
ADMIN_NUMBERS=554896742125,554896742125@c.us,554896742125@s.whatsapp.net
```

---

## 📊 Exemplo de Debug Completo

### **Cenário: Funcionando ✅**

```bash
# Inicialização
👥 Administradores configurados: {
  count: 3,
  source: 'ADMIN_NUMBERS env var',
  admins: [ '554896742125', '554896106006', '554899423230' ]
}

# Mensagem recebida
📋 Adaptando mensagem: {
  isGroup: true,
  participant: '554896742125@s.whatsapp.net',
  senderId: '554896742125@s.whatsapp.net'
}

# Verificação
🔐 Verificando admin: {
  phoneId: '554896742125@s.whatsapp.net',
  normalizedPhone: '554896742125'
}

# Comparação (primeira iteração)
🔍 Comparando: {
  normalizedPhone: '554896742125',
  normalizedAdmin: '554896742125',
  match: true  ✅
}

✅ Admin encontrado!
```

### **Cenário: Não Funcionando ❌**

```bash
# Inicialização
👥 Administradores configurados: {
  count: 4,
  source: 'defaultAdmins',  ❌ Usando default, não env var!
  admins: [ '554896742125@c.us', ... ]
}

# Mensagem recebida
📋 Adaptando mensagem: {
  participant: '5548999999999@s.whatsapp.net'  ❌ Número diferente!
}

# Verificação
🔐 Verificando admin: {
  phoneId: '5548999999999@s.whatsapp.net',
  normalizedPhone: '5548999999999'
}

# Comparação (todas as iterações)
🔍 Comparando: { normalizedPhone: '5548999999999', normalizedAdmin: '554896742125', match: false }
🔍 Comparando: { normalizedPhone: '5548999999999', normalizedAdmin: '554896106006', match: false }
🔍 Comparando: { normalizedPhone: '5548999999999', normalizedAdmin: '554899423230', match: false }

❌ Não é admin!
```

**Problema:** Número do WhatsApp (`5548999999999`) é diferente do configurado (`554896742125`)

---

## 🆘 Se Nada Funcionar

1. **Copie os logs completos** da inicialização e do comando
2. **Verifique:**
   - Qual número aparece em `participant`?
   - Qual número está em `admins`?
   - São iguais (sem contar @... no final)?
3. **Me envie os logs** para análise

---

## 📝 Comando para Testar Localmente

Se quiser testar localmente antes de fazer deploy:

```bash
# Definir admin
export ADMIN_NUMBERS="554896742125,554896106006"

# Rodar bot
npm run dev

# Enviar mensagem de teste
curl -X POST http://localhost:3000/webhook/evolution \
  -H "Content-Type: application/json" \
  -d @test-webhook.json
```

---

**Última atualização:** 2025-10-31  
**Commit:** 9df3578 - debug: adicionar logs extremamente detalhados

