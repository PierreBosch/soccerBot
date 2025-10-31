# 🎵 Troubleshooting - Envio de Áudio

Este documento detalha o problema com envio de áudio e as soluções implementadas.

---

## 🐛 Problema Relatado

O envio de áudios não estava funcionando com a Evolution API v2.

---

## 🔍 Investigação

### **1. Problema no Payload**

**❌ Payload INCORRETO (antes):**
```javascript
POST /message/sendWhatsAppAudio/{instance}
{
  "number": "554896742125@s.whatsapp.net",
  "audioMessage": {
    "audio": "base64..."
  },
  "options": {
    "delay": 1000,
    "presence": "recording",
    "encoding": true
  }
}
```

**✅ Payload CORRETO (agora):**
```javascript
POST /message/sendWhatsAppAudio/{instance}
{
  "number": "554896742125@s.whatsapp.net",
  "audio": "base64_string_aqui"
}
```

### **2. Formato do Arquivo**

**Arquivos atuais:**
- `src/audios/jantinha.mp3`
- `src/audios/audio-problematico.mp3`
- `src/audios/a-vida-e-um-lazer.mp3`
- `src/audios/audio-parmegiana.mp3`

**Formato recomendado pela Evolution API:**
- `.ogg` (audio/ogg)

**Formato atual:**
- `.mp3` (audio/mp3)

---

## ✅ Correções Implementadas

### **1. Corrigido o Payload**

Arquivo: `src/services/evolution-client.js`

```javascript
async sendAudio(to, audioBase64) {
  try {
    const cleanBase64 = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
    
    const response = await this.client.post('/sendWhatsAppAudio/' + this.instanceName, {
      number: to,
      audio: cleanBase64  // ✅ Direto, sem audioMessage
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao enviar áudio:', error.response?.data);
    throw error;
  }
}
```

### **2. Adicionados Logs Detalhados**

Agora os logs mostram:
- ✅ Tamanho do base64
- ✅ Preview do conteúdo
- ✅ Status HTTP do erro
- ✅ Detalhes da resposta da API

---

## 🚀 Como Testar

### **1. Deploy no EasyPanel**
```bash
# Fazer deploy da branch feature/evolution-api
```

### **2. Enviar comando no WhatsApp**
```
/vidao
/problematico
/parmegiana
/jantinha
```

### **3. Verificar logs**
```bash
# Logs esperados em caso de sucesso:
📤 Enviando áudio: { to: '...', base64Length: 123456, preview: '...' }
✅ Áudio enviado com sucesso: { to: '...', response: {...} }

# Logs em caso de erro:
❌ Erro ao enviar áudio: { to: '...', error: '...', status: 400, statusText: 'Bad Request' }
```

---

## 🔧 Soluções Alternativas (se ainda não funcionar)

### **Solução A: Converter MP3 para OGG**

#### **Opção 1: Converter manualmente**
```bash
# Instalar ffmpeg
brew install ffmpeg  # macOS
apt-get install ffmpeg  # Linux

# Converter arquivos
cd src/audios
ffmpeg -i jantinha.mp3 jantinha.ogg
ffmpeg -i audio-problematico.mp3 audio-problematico.ogg
ffmpeg -i a-vida-e-um-lazer.mp3 a-vida-e-um-lazer.ogg
ffmpeg -i audio-parmegiana.mp3 audio-parmegiana.ogg
```

#### **Opção 2: Converter programaticamente**
```bash
# Instalar biblioteca
npm install fluent-ffmpeg

# Adicionar conversão no código
```

**Código de exemplo:**
```javascript
const ffmpeg = require('fluent-ffmpeg');

async function convertToOgg(inputPath) {
  const outputPath = inputPath.replace('.mp3', '.ogg');
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('ogg')
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
}
```

---

### **Solução B: Usar URL ao invés de Base64**

#### **1. Hospedar áudios publicamente**
```bash
# Opções:
- AWS S3
- Cloudinary
- Firebase Storage
- Servidor próprio com HTTPS
```

#### **2. Modificar código para enviar URL**
```javascript
async sendAudio(to, audioUrl) {
  const response = await this.client.post('/sendWhatsAppAudio/' + this.instanceName, {
    number: to,
    audio: audioUrl  // URL pública ao invés de base64
  });
  return response.data;
}
```

---

### **Solução C: Usar endpoint diferente**

Testar com `/sendAudio` ao invés de `/sendWhatsAppAudio`:

```javascript
const response = await this.client.post('/sendAudio/' + this.instanceName, {
  number: to,
  audio: cleanBase64
});
```

---

## 📊 Diagnóstico de Erros

### **Erro: "Method not available on WhatsApp Business API"**
**Causa:** Instância conectada como WhatsApp Business API (não suporta alguns recursos)  
**Solução:** Usar instância WhatsApp Web (não Business API)

### **Erro: "Bad Request" ou status 400**
**Causa:** Payload incorreto ou formato de áudio não suportado  
**Solução:** 
1. Verificar payload (já corrigido)
2. Converter para OGG
3. Testar com URL

### **Erro: "Invalid base64"**
**Causa:** Base64 malformado ou com prefixo incorreto  
**Solução:** 
1. Verificar se prefixo `data:audio/...` está sendo removido (já implementado)
2. Verificar se arquivo foi lido corretamente

### **Erro: Timeout ou sem resposta**
**Causa:** Arquivo muito grande  
**Solução:**
1. Comprimir áudio
2. Reduzir qualidade/bitrate
3. Usar URL ao invés de base64

---

## 📝 Checklist de Verificação

Antes de reportar problema, verificar:

- [ ] Payload está no formato correto (sem `audioMessage`)
- [ ] Base64 não tem prefixo `data:audio/...`
- [ ] Arquivo de áudio existe e é legível
- [ ] Número do destinatário está normalizado
- [ ] Evolution API está respondendo (testar `/health`)
- [ ] Instância está conectada
- [ ] Logs mostram detalhes do erro

---

## 🎯 Status Atual

### ✅ Implementado:
- Payload correto
- Logs detalhados
- Remoção de prefixo base64
- Detecção automática de base64 vs arquivo

### ⏳ Pendente (se necessário):
- Conversão MP3 → OGG
- Suporte para URL de áudio
- Compressão de áudio

---

## 📚 Referências

- [Evolution API v2 - Send Audio](https://doc.evolution-api.com/v2/api-reference/message-controller/send-audio)
- [GitHub Issue #1475](https://github.com/EvolutionAPI/evolution-api/issues/1475) - Problemas com envio de áudio
- [Formato OGG vs MP3](https://en.wikipedia.org/wiki/Ogg)

---

## 🆘 Suporte

Se o problema persistir após todas as tentativas:

1. **Verificar logs detalhados** no EasyPanel
2. **Testar com curl** direto na API
3. **Reportar issue** no GitHub da Evolution API
4. **Consultar comunidade** no Discord/Telegram

---

**Última atualização:** 2025-10-31  
**Commit:** 329828e - fix: corrigir payload do sendAudio para Evolution API

