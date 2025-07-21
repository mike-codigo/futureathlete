# Future Athlete - Plataforma de Carreira Atlética com IA

## 🚀 Projeto Pronto para Deploy

Uma plataforma completa que gera planos de carreira personalizados para atletas usando IA e envia automaticamente via WhatsApp.

## ✨ Funcionalidades Principais

### 🎯 **Chat AI Inteligente**
- Geração de planos de carreira personalizados via Groq API
- Análise baseada em esporte, altura, peso e objetivos
- Respostas em Markdown com formatação rica
- Referências científicas e valores cristãos

### 📱 **Integração WhatsApp Completa**
- Envio automático de mensagem personalizada
- Anexo PDF com plano completo de carreira
- Múltiplos fallbacks para garantir entrega
- Formato correto da Evolution API

### 📞 **Formatação Automática de Telefone**
- Formatação em tempo real com Cleave.js
- Padrão brasileiro: +55 11 9 8765-4321
- Validação automática de DDD e número

### 📄 **Geração de PDF Profissional**
- Layout personalizado com dados do usuário
- Conteúdo completo do plano de carreira
- Download automático disponível
- Otimizado para WhatsApp

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: Tailwind CSS
- **IA**: Groq API (Llama 3.1)
- **PDF**: jsPDF
- **WhatsApp**: Evolution API
- **Formatação**: Cleave.js
- **Animações**: Typed.js
- **3D**: Model Viewer
- **Markdown**: Marked.js + DOMPurify

## 📁 Estrutura do Projeto

```
futureathlete/
├── index.html                 # Página principal
├── README.md                  # Documentação
├── WHATSAPP_INTEGRATION.md    # Documentação WhatsApp
├── js/
│   ├── chat_ai_production.js  # Chat AI principal (PRODUÇÃO)
│   ├── whatsapp_integration.js # Integração WhatsApp
│   └── index.js              # Carrossel de esportes
├── img/                      # Imagens e logos
├── obj/                      # Modelo 3D
└── test_*.html              # Arquivos de teste
```

## 🔧 Configuração para Deploy

### 1. **APIs Necessárias**

#### Groq API
```javascript
// Em js/chat_ai_production.js
Authorization: 'Bearer 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'
```

#### Evolution API
```javascript
// Em js/whatsapp_integration.js
const evolutionConfig = {
  apiKey: '626FBF6D06C4-424C-998F-88A2DC5ED1C6',
  instance: 'Muvi Company',
  baseUrl: 'https://evolution.murilosilva.com'
};
```

### 2. **CDNs Utilizadas**
- Tailwind CSS
- jsPDF
- Typed.js
- Marked.js
- DOMPurify
- Cleave.js
- Model Viewer

### 3. **Compatibilidade**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile (iOS/Android)

## 🚀 Como Fazer Deploy

### Opção 1: Hospedagem Estática (Recomendado)
1. **Netlify**:
   - Arraste a pasta do projeto para netlify.com/drop
   - Configure domínio personalizado
   - SSL automático

2. **Vercel**:
   ```bash
   npm i -g vercel
   vercel --prod
   ```

3. **GitHub Pages**:
   - Push para repositório GitHub
   - Ativar GitHub Pages nas configurações

### Opção 2: Servidor Web
1. **Apache/Nginx**:
   - Copie arquivos para `/var/www/html/`
   - Configure SSL
   - Configure CORS se necessário

2. **Node.js (Express)**:
   ```javascript
   const express = require('express');
   const app = express();
   app.use(express.static('.'));
   app.listen(3000);
   ```

## 🧪 Testes Disponíveis

- **`test_complete_integration.html`** - Teste completo da integração
- **`debug_evolution_payload.html`** - Debug da API Evolution
- **`test_whatsapp_pdf.html`** - Teste específico WhatsApp + PDF

## 📱 Fluxo do Usuário

1. **Acessa o site** → Vê modelo 3D e formulário
2. **Preenche dados** → Formatação automática do telefone
3. **Clica "Começar Planejamento"** → Validação e transição
4. **Chat com IA** → Conversa personalizada
5. **Recebe plano** → PDF gerado automaticamente
6. **WhatsApp automático** → Mensagem + PDF enviados

## 🔒 Segurança

- ✅ Validação de entrada no frontend
- ✅ Sanitização de HTML (DOMPurify)
- ✅ HTTPS obrigatório para APIs
- ✅ Rate limiting nas APIs externas
- ✅ Dados não armazenados no servidor

## 📊 Analytics (Opcional)

Para adicionar tracking:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
</script>
```

## 🐛 Troubleshooting

### Problema: Botão não funciona
- ✅ Verificar console do navegador (F12)
- ✅ Confirmar se todos os scripts carregaram
- ✅ Testar em modo incógnito

### Problema: WhatsApp não envia
- ✅ Verificar API key da Evolution
- ✅ Confirmar instância ativa
- ✅ Testar com `debug_evolution_payload.html`

### Problema: PDF não gera
- ✅ Verificar se jsPDF carregou
- ✅ Testar em navegador diferente
- ✅ Verificar console para erros

## 📞 Suporte

Para problemas técnicos:
1. Verificar console do navegador (F12)
2. Testar arquivos de debug
3. Verificar status das APIs externas
4. Confirmar compatibilidade do navegador

## 🎉 Status do Projeto

**✅ PRONTO PARA PRODUÇÃO**

- ✅ Chat AI funcional
- ✅ Formatação automática de telefone
- ✅ Integração WhatsApp completa
- ✅ Geração de PDF
- ✅ Interface responsiva
- ✅ Modelo 3D carregando
- ✅ Validação de formulário
- ✅ Tratamento de erros
- ✅ Documentação completa

---

**Future Athlete** - Transformando carreiras atléticas com tecnologia de ponta! 🚀