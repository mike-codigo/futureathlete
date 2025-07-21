// Chat AI - Versão de Produção Completa
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Chat AI Production carregado!');
  
  // Elementos do DOM
  const userForm = document.getElementById('user-form');
  const chatArea = document.getElementById('chat-area');
  const startChatButton = document.getElementById('start-chat');
  const chatContainer = document.querySelector('#chat_ai .space-y-2');
  const textarea = document.querySelector('#chat_ai textarea');
  const sendButton = textarea ? textarea.nextElementSibling : null;
  const chatInputArea = document.getElementById('chat-input-area');
  const phoneInput = document.getElementById('user-phone');
  
  // Verificar se todos os elementos foram encontrados
  const elementsCheck = {
    userForm: !!userForm,
    chatArea: !!chatArea,
    startChatButton: !!startChatButton,
    chatContainer: !!chatContainer,
    textarea: !!textarea,
    sendButton: !!sendButton,
    chatInputArea: !!chatInputArea,
    phoneInput: !!phoneInput
  };
  
  console.log('✅ Elementos encontrados:', elementsCheck);
  
  // Formatação manual de telefone
  if (phoneInput) {
    phoneInput.placeholder = '+55 (46) 98800-0728';
    console.log('📱 Formatação de telefone configurada');

    phoneInput.addEventListener('input', function(e) {
      // Manter apenas dígitos
      let value = e.target.value.replace(/\D/g, '');
      
      // Adicionar prefixo do país se necessário
      if (!value.startsWith('55') && value.length > 0) {
        value = '55' + value;
      }
      
      // Aplicar formatação
      if (value.length > 2) {
        let formatted = '+55 (' + value.substring(2, 4);
        
        if (value.length > 4) {
          formatted += ') ' + value.substring(4, 9);
          
          if (value.length > 9) {
            formatted += '-' + value.substring(9, 13);
          }
        }
        e.target.value = formatted;
      }
    });
  }
  
  // Dados do usuário
  let userData = {
    name: '',
    phone: '',
    email: '',
    sport: '',
    height: '',
    weight: ''
  };
  
  // Histórico de mensagens para contexto
  let messageHistory = [
    { 
      role: "system", 
      content: `Você é um assistente de IA para a Future Athlete Agência, atuando como o melhor coach de atletas do mundo.
      
      Seu objetivo é ajudar atletas a desenvolverem suas carreiras fornecendo conselhos personalizados, recomendações de treinamento e estratégias de marketing.
      
      Diretrizes importantes:
      1. SEMPRE responda em português brasileiro.
      2. Seja conciso, prático e encorajador.
      3. Foque em passos acionáveis que possam ajudar atletas a alcançarem seus objetivos profissionais.
      4. Baseie seus conselhos nas melhores técnicas e artigos científicos, citando referências quando apropriado.
      5. Personalize suas respostas com base no esporte, altura, peso e outros dados fornecidos pelo usuário.
      6. Use linguagem técnica apropriada para the esporte específico.
      7. Inclua referências a estudos científicos e atletas de elite quando relevante.
      8. Formate suas respostas com Markdown para melhor legibilidade.
      9. Sempre termine sua resposta com uma mensagem motivacional sobre sacrifício e dedicação, enfatizando que sucesso não é sobre dinheiro, mas sobre quanto você está disposto a sacrificar pelos seus objetivos.
      10. Use emojis para melhorar a expressão da resposta.
      11. Use markdown para melhorar a legibilidade da resposta, com listas, titulos, tabelas, negrito e itálico.
      12. Lembre-se de valores cristãos e os atributos de Jesus Cristo Fé, esperança, caridade (o puro amor de Cristo), humildade, paciência, obediência, diligência, etc.
      13. Separe os conselhos em ordem cronológica em fases.
      14. Sua resposta deve ter 8192 tokens ou menos, não perca a criatividade estou falando sobre esse limite só para não cortar a resposta.
      15. Apresente uma tabela formatada de treinos tanto na academia tanto de treinos especificos para habilidades do esporte desejado, com quantidade de séries e repetições, também tabela de progressão de peso planejando de acordo com o tempo do objetivo a longo prazo de acordo com os dias e tipos de treinos, dias da semana e outros detalhes relevantes, o cabeçalho da tabela deve em bold.
      16. Use muitas referências cientificas mas no máximo 10, foque em entregar o plano e o que o usuario pediu.
      17. Ao entregar referências de pessoas e atletas busque não somente atletas que estão na midia mas também atletas que quebraram recordes mundiais e outros das redes sociais.`  
    }
  ];
  
  // Função para validar e processar o formulário
  function validateAndStartChat() {
    console.log('🔍 Validando formulário...');
    
    const nameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('user-phone');
    const emailInput = document.getElementById('user-email');
    const sportInput = document.getElementById('user-sport');
    const heightInput = document.getElementById('user-height');
    const weightInput = document.getElementById('user-weight');
    
    // Verificar se todos os campos existem
    if (!nameInput || !phoneInput || !emailInput || !sportInput || !heightInput || !weightInput) {
      console.error('❌ Alguns elementos do formulário não foram encontrados!');
      alert('Erro: Elementos do formulário não encontrados. Recarregue a página.');
      return false;
    }
    
    let isValid = true;
    
    // Validar nome
    if (!nameInput.value.trim()) {
      showError('name-error');
      isValid = false;
    } else {
      hideError('name-error');
      userData.name = nameInput.value.trim();
    }
    
    // Validar telefone
    const phoneNumber = phoneInput.value.trim();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Verificar se tem entre 12 e 13 dígitos (55 + 10 ou 11 dígitos)
    if (!phoneNumber || cleanPhone.length < 12 || cleanPhone.length > 13) {
      showError('phone-error');
      isValid = false;
    } else {
      hideError('phone-error');
      userData.phone = cleanPhone;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError('email-error');
      isValid = false;
    } else {
      hideError('email-error');
      userData.email = emailInput.value.trim();
    }
    
    // Validar esporte
    if (!sportInput.value.trim()) {
      showError('sport-error');
      isValid = false;
    } else {
      hideError('sport-error');
      userData.sport = sportInput.value.trim();
    }
    
    // Validar altura
    if (!heightInput.value || heightInput.value < 50 || heightInput.value > 250) {
      showError('height-error');
      isValid = false;
    } else {
      hideError('height-error');
      userData.height = heightInput.value;
    }
    
    // Validar peso
    if (!weightInput.value || weightInput.value < 20 || weightInput.value > 300) {
      showError('weight-error');
      isValid = false;
    } else {
      hideError('weight-error');
      userData.weight = weightInput.value;
    }
    
    console.log('📊 Validação:', isValid ? 'PASSOU' : 'FALHOU');
    console.log('👤 Dados do usuário:', userData);
    
    if (isValid) {
      startChat();
    }
    
    return isValid;
  }
  
  // Função para mostrar erro
  function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.classList.remove('hidden');
    }
  }
  
  // Função para esconder erro
  function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
  }
  
  // Função para iniciar o chat
  function startChat() {
    console.log('💬 Iniciando chat...');
    
    if (!userForm || !chatArea) {
      console.error('❌ Elementos de transição não encontrados');
      return;
    }
    
    // Animação de transição
    userForm.classList.add('translate-x-[-100%]', 'opacity-0');
    
    setTimeout(() => {
      userForm.style.display = 'none';
      chatArea.style.display = 'flex';
      
      setTimeout(() => {
        chatArea.classList.remove('translate-x-full', 'opacity-0');
      }, 50);
    }, 500);
    
    // Adicionar mensagem inicial da IA
    const initialMessage = `Olá ${userData.name}! 👋 Sou seu assistente da Future Athlete. 
    
Vejo que você pratica ${userData.sport} e tem ${userData.height}cm de altura e ${userData.weight}kg. 

Como posso ajudar a melhorar seu desempenho e carreira esportiva hoje? 🚀`;
    
    // Adicionar ao histórico
    messageHistory.push({ role: "assistant", content: initialMessage });
    
    // Mostrar mensagem com animação
    setTimeout(() => {
      addAIMessage(initialMessage);
    }, 1000);
  }
  
  // Função para adicionar mensagem do usuário
  function addUserMessage(message) {
    if (!chatContainer) return;
    
    const userBubble = document.createElement('div');
    userBubble.className = 'flex justify-end';
    userBubble.innerHTML = `
      <div class="chat-bubble bg-green-400 bg-opacity-30 p-2 sm:p-3 max-w-[90%]">
        <p class="text-xs sm:text-sm md:text-base text-white">${message}</p>
      </div>
    `;
    chatContainer.appendChild(userBubble);
    
    messageHistory.push({ role: "user", content: message });
    scrollToBottom();
  }
  
  // Função para adicionar mensagem da IA
  function addAIMessage(message) {
    if (!chatContainer) return;
    
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble bg-gray-800 p-2 sm:p-3 max-w-[90%] mx-auto';
    
    const typedElement = document.createElement('div');
    typedElement.className = 'markdown text-xs sm:text-sm md:text-base text-white';
    aiBubble.appendChild(typedElement);
    
    chatContainer.appendChild(aiBubble);
    
    // Animação de escrita
    if (typeof Typed !== 'undefined') {
      let formattedMessage = message;
      if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        formattedMessage = DOMPurify.sanitize(marked.parse(message));
      }
      
      new Typed(typedElement, {
        strings: [formattedMessage],
        typeSpeed: 3,
        showCursor: true,
        cursorChar: '|',
        onStringTyped: function() {
          scrollToBottom();
        },
        onComplete: function() {
          setTimeout(() => {
            const cursor = aiBubble.querySelector('.typed-cursor');
            if (cursor) cursor.remove();
            scrollToBottom();
          }, 500);
        }
      });
    } else {
      typedElement.innerHTML = message;
      scrollToBottom();
    }
    
    messageHistory.push({ role: "assistant", content: message });
  }
  
  // Função para mostrar indicador de digitação
  function showTypingIndicator() {
    if (!chatContainer) return null;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-bubble bg-gray-800 p-2 sm:p-3 max-w-[90%] mx-auto typing-indicator';
    typingIndicator.innerHTML = `
      <div class="flex space-x-2">
        <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
        <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
        <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
      </div>
    `;
    chatContainer.appendChild(typingIndicator);
    scrollToBottom();
    return typingIndicator;
  }
  
  // Função para enviar mensagem para Groq API
  async function sendToGroq(userMessage) {
    const typingIndicator = showTypingIndicator();
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: messageHistory,
          max_tokens: 8192,
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      
      if (typingIndicator) typingIndicator.remove();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content;
        addAIMessage(aiResponse);
        
        // Processar resposta final (gerar PDF e enviar WhatsApp)
        setTimeout(() => {
          processFinalResponse(aiResponse);
        }, 2000);
      } else {
        handleApiError(data);
      }
    } catch (error) {
      if (typingIndicator) typingIndicator.remove();
      console.error('❌ Erro na API Groq:', error);
      addAIMessage("Desculpe, houve um erro ao conectar com meu cérebro. Por favor, tente novamente mais tarde.");
    }
  }
  
  // Função para processar resposta final
  async function processFinalResponse(aiResponse) {
    if (!chatInputArea) return;
    
    // Esconder área de input
    chatInputArea.style.display = 'none';
    
    // Gerar PDF
    let pdfUrl = null;
    if (typeof window.jspdf !== 'undefined') {
      pdfUrl = generatePDF(aiResponse);
    }
    
    // Tentar enviar via WhatsApp
    if (typeof WhatsAppIntegration !== 'undefined' && pdfUrl) {
      try {
        // Mostrar progresso
        const progressElement = createProgressElement();
        chatContainer.appendChild(progressElement);
        scrollToBottom();
        
        const whatsappIntegration = new WhatsAppIntegration();
        const result = await whatsappIntegration.sendToWhatsApp(userData, pdfUrl);
        
        // Remover progresso
        progressElement.remove();
        
        if (result.success) {
          const successElement = whatsappIntegration.createSuccessElement(result.method);
          chatContainer.appendChild(successElement);
          scrollToBottom();
        } else if (result.manual) {
          const manualElement = whatsappIntegration.createManualElement(result.whatsappUrl, result.message);
          chatContainer.appendChild(manualElement);
          scrollToBottom();
        } else {
          const errorElement = whatsappIntegration.createErrorElement();
          chatContainer.appendChild(errorElement);
          scrollToBottom();
        }
      } catch (error) {
        console.error('❌ Erro na integração WhatsApp:', error);
      }
    }
    
    // Adicionar mensagem com botão de download
    const pdfMessage = createPDFMessage(pdfUrl);
    chatContainer.appendChild(pdfMessage);
    scrollToBottom();
    
    // Marcar como usado
    //localStorage.setItem('hasUsedFreeChat', 'true');
  }
  
  // Função para criar elemento de progresso
  function createProgressElement() {
    const progressElement = document.createElement('div');
    progressElement.className = 'chat-bubble bg-blue-600 bg-opacity-20 p-3 max-w-[90%] mx-auto';
    progressElement.innerHTML = `
      <div class="flex items-center text-blue-400">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
        <p class="text-sm">📱 Enviando para seu WhatsApp...</p>
      </div>
      <div class="mt-2 text-xs text-gray-400">
        <div>⏳ Gerando mensagem personalizada...</div>
        <div>⏳ Preparando PDF...</div>
        <div>⏳ Enviando mensagem + arquivo...</div>
      </div>
    `;
    return progressElement;
  }
  
  // Função para criar mensagem do PDF
  function createPDFMessage(pdfUrl) {
    const pdfMessage = document.createElement('div');
    pdfMessage.className = 'chat-bubble bg-gray-800 p-2 sm:p-3 max-w-[90%] mx-auto pdf-message';
    
    let downloadButton = '';
    if (pdfUrl) {
      downloadButton = `
        <a href="${pdfUrl}" download="plano_carreira_${userData.name.replace(/\s+/g, '_')}.pdf" class="pdf-button inline-flex items-center bg-green-400 text-black px-3 py-1 rounded-full text-xs font-bold transition duration-300 mr-2">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Baixar PDF
        </a>
      `;
    }
    
    pdfMessage.innerHTML = `
      <p class="text-xs sm:text-sm md:text-base text-gray-600 mb-2"><b class="text-green-700">Seu plano de carreira personalizado está pronto!</b> Lembre-se que para alcançar seus objetivos, você nunca conseguirá fazer tudo sozinho. Em algum momento, você precisará de ajuda profissional.</p>
      <div class="flex flex-col sm:flex-row gap-2">
        ${downloadButton}
        <a href="#plans" class="plan-button inline-flex items-center bg-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold transition duration-300">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          Conhecer Nossos Planos
        </a>
      </div>
    `;
    
    return pdfMessage;
  }
  
  // Função para gerar PDF - Versão Estilizada
  function generatePDF(conversation) {
    if (typeof window.jspdf === 'undefined') {
      console.warn('⚠️ jsPDF não está disponível');
      return null;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cores da paleta
    const primaryGreen = [0, 255, 136];
    const secondaryOrange = [255, 107, 53];
    const darkGray = [26, 26, 26];
    const begeColor = [245, 242, 232];
    
    // Margens seguras para o texto
    const leftMargin = 20;
    const rightMargin = 190;
    const textWidth = rightMargin - leftMargin;
    
    // Função para adicionar fundo a uma página
    function addNotebookBackground(doc) {
      // Fundo bege claro
      doc.setFillColor(begeColor[0], begeColor[1], begeColor[2]);
      doc.rect(0, 0, 210, 297, 'F');
    }
    
    // Função para adicionar cabeçalho
    function addHeader(doc) {
      doc.setFillColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.rect(0, 0, 210, 20, 'F');
      
      // Título principal - único com tamanho maior
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
      doc.setFontSize(16);
      doc.text("FUTURE ATHLETE", 105, 10, { align: "center" });
      
      doc.setTextColor(secondaryOrange[0], secondaryOrange[1], secondaryOrange[2]);
      doc.setFontSize(10);
      doc.text("PLANO DE CARREIRA ATLÉTICA", 105, 16, { align: "center" });
      
      // Informações de contato no cabeçalho
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      
      // Adicionar links com verificação de largura
      const siteText = "www.futureathlete.com.br";
      const emailText = "contato@futureathlete.com.br";
      const whatsappText = "WhatsApp: +5511999999999";
      
      // Garantir que os textos não ultrapassem as margens
      const siteLines = doc.splitTextToSize(siteText, 80);
      const emailLines = doc.splitTextToSize(emailText, 80);
      
      doc.textWithLink(siteLines[0], 20, 8, { url: 'https://www.futureathlete.com.br' });
      doc.textWithLink(emailLines[0], 20, 14, { url: 'mailto:contato@futureathlete.com.br' });
    }
    
    // Função para adicionar rodapé
    function addFooter(doc, pageNumber, totalPages) {
      doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
      doc.line(20, 280, 190, 280);
      
      doc.setTextColor(secondaryOrange[0], secondaryOrange[1], secondaryOrange[2]);
      doc.setFontSize(8);
      doc.text("FUTURE ATHLETE - PLANO PERSONALIZADO", 20, 287);
      
      // Informações de contato no rodapé
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFont("helvetica", "normal");
      
      // Adicionar links com verificação de largura
      const whatsappText = "WhatsApp: +5511999999999";
      const emailText = "contato@futureathlete.com.br";
      const siteText = "www.futureathlete.com.br";
      
      doc.textWithLink(whatsappText, 20, 293, { url: 'https://wa.me/5511999999999' });
      doc.textWithLink(emailText, 105, 293, { align: "center", url: 'mailto:contato@futureathlete.com.br' });
      doc.textWithLink(siteText, 105, 297, { align: "center", url: 'https://www.futureathlete.com.br' });
      
      // Número da página
      doc.text(`Página ${pageNumber} de ${totalPages}`, 190, 293, { align: "right" });
    }
    
    // Preparar o conteúdo para formatação
    // Processar o conteúdo da conversa para manter formatação básica
    let processedContent = conversation;
    
    // Extrair títulos para formatação especial
    const titleRegex = /#{1,3} (.*?)(?:\n|$)/g;
    const titles = [];
    let match;
    
    while ((match = titleRegex.exec(processedContent)) !== null) {
      titles.push({
        level: match[0].indexOf(' '), // Número de # no título
        text: match[1],
        position: match.index
      });
    }
    
    // Melhorar a formatação de listas
    processedContent = processedContent
      .replace(/- (.*?)(?:\n|$)/g, "• $1\n") // Substituir hífens por bullets
      .replace(/(\d+)\. (.*?)(?:\n|$)/g, "$1) $2\n"); // Melhorar numeração
    
    // Remover markdown básico para texto normal
    processedContent = processedContent
      .replace(/#{1,6} (.*?)(?:\n|$)/g, "$1\n")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1");
    
    // Dividir o conteúdo em parágrafos
    const paragraphs = processedContent.split('\n\n');
    
    // Iniciar a primeira página
    let currentPage = 1;
    let yPosition = 30; // Posição inicial após o cabeçalho
    
    // Adicionar fundo e cabeçalho à primeira página
    addNotebookBackground(doc);
    addHeader(doc);
    
    // Informações do usuário
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Nome: ${userData.name}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Esporte: ${userData.sport}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Altura: ${userData.height}cm | Peso: ${userData.weight}kg`, 20, yPosition);
    yPosition += 10;
    
    // Linha divisória
    doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Processar parágrafos
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      if (!paragraph) continue;
      
      // Verificar se é um título
      const isTitle = titles.some(title => paragraph.includes(title.text));
      
      if (isTitle) {
        // Formatar como título - mesmo tamanho, mas em negrito
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        
        // Garantir quebra de linha para títulos longos
        const titleLines = doc.splitTextToSize(paragraph, textWidth);
        
        // Verificar se há espaço suficiente para o título + linha
        if (yPosition > 260) {
          // Adicionar rodapé à página atual
          addFooter(doc, currentPage, Math.ceil(paragraphs.length / 20));
          
          // Adicionar nova página
          doc.addPage();
          currentPage++;
          
          // Adicionar fundo e cabeçalho à nova página
          addNotebookBackground(doc);
          addHeader(doc);
          
          // Resetar posição Y
          yPosition = 30;
        }
        
        // Adicionar título
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text(titleLines, leftMargin, yPosition);
        
        // Ajustar posição Y com base no número de linhas
        yPosition += titleLines.length * 6;
        
        // Adicionar sublinhado laranja apenas para a primeira linha
        doc.setDrawColor(secondaryOrange[0], secondaryOrange[1], secondaryOrange[2]);
        const titleWidth = doc.getTextWidth(titleLines[0]);
        doc.line(leftMargin, yPosition - 3, leftMargin + titleWidth, yPosition - 3);
        yPosition += 4;
      } else if (paragraph.startsWith('•') || /^\d+\)/.test(paragraph)) {
        // Formatar como item de lista - mesmo tamanho, normal
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        // Dividir o item em linhas para caber na página
        const textLines = doc.splitTextToSize(paragraph, textWidth - 5);
        
        // Verificar se há espaço suficiente para o item
        if (yPosition + (textLines.length * 6) > 270) {
          // Adicionar rodapé à página atual
          addFooter(doc, currentPage, Math.ceil(paragraphs.length / 20));
          
          // Adicionar nova página
          doc.addPage();
          currentPage++;
          
          // Adicionar fundo e cabeçalho à nova página
          addNotebookBackground(doc);
          addHeader(doc);
          
          // Resetar posição Y
          yPosition = 30;
        }
        
        // Adicionar texto com indentação
        doc.text(textLines, leftMargin + 5, yPosition);
        yPosition += (textLines.length * 6) + 2;
      } else {
        // Formatar como texto normal
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        // Dividir o parágrafo em linhas para caber na página
        const textLines = doc.splitTextToSize(paragraph, textWidth);
        
        // Verificar se há espaço suficiente para o parágrafo
        if (yPosition + (textLines.length * 6) > 270) {
          // Adicionar rodapé à página atual
          addFooter(doc, currentPage, Math.ceil(paragraphs.length / 20));
          
          // Adicionar nova página
          doc.addPage();
          currentPage++;
          
          // Adicionar fundo e cabeçalho à nova página
          addNotebookBackground(doc);
          addHeader(doc);
          
          // Resetar posição Y
          yPosition = 30;
        }
        
        // Adicionar texto
        doc.text(textLines, leftMargin, yPosition);
        yPosition += (textLines.length * 6) + 2;
      }
    }
    
    // Adicionar rodapé à última página
    addFooter(doc, currentPage, currentPage);
    
    // Adicionar mensagem motivacional no rodapé da última página
    doc.setTextColor(secondaryOrange[0], secondaryOrange[1], secondaryOrange[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    const motivationalMessage = "O sucesso não é sobre dinheiro, mas sobre quanto você está disposto a sacrificar pelos seus objetivos. Cada gota de suor é um passo em direção à grandeza.";
    const splitMotivational = doc.splitTextToSize(motivationalMessage, textWidth);
    doc.text(splitMotivational, leftMargin, 275);
    
    // Gerar URL do PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  }
  
  // Função para scroll automático
  function scrollToBottom() {
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  
  // Função para lidar com erros da API
  function handleApiError(data) {
    addAIMessage("Desculpe, não consegui gerar uma resposta no momento. Por favor, tente novamente.");
    console.error('❌ Erro inesperado da API:', data);
  }
  
  // Event Listeners
  if (startChatButton) {
    startChatButton.addEventListener('click', function(e) {
      console.log('🔘 Botão "Começar Planejamento" clicado!');
      e.preventDefault();
      validateAndStartChat();
    });
    console.log('✅ Event listener do botão adicionado');
  } else {
    console.error('❌ Botão "Começar Planejamento" não encontrado!');
  }
  
  // Event listeners para o chat
  if (sendButton) {
    sendButton.addEventListener('click', function() {
      if (!textarea) return;
      
      const userMessage = textarea.value.trim();
      if (userMessage) {
        addUserMessage(userMessage);
        textarea.value = '';
        sendToGroq(userMessage);
      }
    });
  }
  
  if (textarea) {
    textarea.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (sendButton) sendButton.click();
      }
    });
  }
  
  // Verificar se já usou o chat gratuito
  const hasUsedFreeChat = localStorage.getItem('hasUsedFreeChat') === 'false';
  if (hasUsedFreeChat && userForm) {
    const limitMessage = document.createElement('div');
    limitMessage.className = 'bg-gray-800 rounded-xl p-3 max-w-lg mx-auto text-center mb-4';
    limitMessage.innerHTML = `
      <p class="text-yellow-400 font-bold mb-2">Você já utilizou seu plano gratuito</p>
      <p class="text-xs sm:text-sm text-gray-300">Para continuar recebendo planos personalizados e acompanhamento profissional, conheça nossa plataforma completa.</p>
      <button class="mt-3 bg-green-400 text-black px-4 py-2 rounded-xl font-bold hover:bg-green-300 transition duration-300 w-full">Conhecer Plataforma</button>
    `;
    if (userForm.parentNode) {
      userForm.parentNode.insertBefore(limitMessage, userForm);
      userForm.style.display = 'none';
    }
  }
  
  console.log('🎉 Chat AI Production inicializado com sucesso!');
});
