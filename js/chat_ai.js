// Chat AI com animação de escrita e formatação Markdown
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const userForm = document.getElementById('user-form');
  const chatArea = document.getElementById('chat-area');
  const startChatButton = document.getElementById('start-chat');
  const chatContainer = document.querySelector('#chat_ai .space-y-2');
  const textarea = document.querySelector('#chat_ai textarea');
  const sendButton = textarea.nextElementSibling;
  const chatInputArea = document.getElementById('chat-input-area');
  
  // Contador de uso por IP
  let hasUsedFreeChat = localStorage.getItem('hasUsedFreeChat') === 'true';
  
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
      6. Use linguagem técnica apropriada para o esporte específico.
      7. Inclua referências a estudos científicos e atletas de elite quando relevante.
      8. Formate suas respostas com Markdown para melhor legibilidade.
      9. Sempre termine sua resposta com uma mensagem motivacional sobre sacrifício e dedicação, enfatizando que sucesso não é sobre dinheiro, mas sobre quanto você está disposto a sacrificar pelos seus objetivos.
      10. Use emojis para melhorar a expressão da resposta.
      11. Use markdown para melhorar a legibilidade da resposta, com listas, titulos, tabelas, negrito e itálico.
      12. Lembre-se de valores cristãos e os atributos de Jesus Cristo Fé, esperança, caridade (o puro amor de Cristo), humildade, paciência, obediência, diligência, etc.
      13. Separe os conselhos em ordem cronológica em fases.
      14. Sua resposta deve ter 8192 tokens ou menos, não perca a criatividade estou falando sobre esse limite só para não cortar a resposta.
      15. Apresente uma tabela formatada de treinos tanto na academia tanto de treinos especificos para habilidades do esporte desejado, com quantidade de séries e repetições, também tabela de progressão de peso planejando de acordo com o tempo do objetivo a longo prazo de acordo com os dias e tipos de treinos, dias da semana e outros detalhes relevantes, o cabeçalho da tabela deve ser em bold.
      16. Use muitas referências cientificas mas no máximo 10, foque em entregar o plano e o que o usuario pediu.
      17. Ao entregar referências de pessoas e atletas busque não somente atletas que estão na midia mas também atletas que quebraram recordes mundiais e outros das redes sociais. 
`  
    }
  ];
  
  // Validação de formulário
  startChatButton.addEventListener('click', function() {
    const nameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('user-phone');
    const emailInput = document.getElementById('user-email');
    const sportInput = document.getElementById('user-sport');
    const heightInput = document.getElementById('user-height');
    const weightInput = document.getElementById('user-weight');
    
    let isValid = true;
    
    // Validar nome
    if (!nameInput.value.trim()) {
      document.getElementById('name-error').classList.remove('hidden');
      isValid = false;
    } else {
      document.getElementById('name-error').classList.add('hidden');
      userData.name = nameInput.value.trim();
    }
    
    // Validar telefone (WhatsApp brasileiro)
    const phoneNumber = phoneInput.value.trim();
    try {
      const parsedNumber = libphonenumber.parsePhoneNumber(phoneNumber, 'BR');
      if (!parsedNumber || !parsedNumber.isValid()) {
        document.getElementById('phone-error').classList.remove('hidden');
        isValid = false;
      } else {
        document.getElementById('phone-error').classList.add('hidden');
        userData.phone = parsedNumber.format('E.164');
      }
    } catch (e) {
      document.getElementById('phone-error').classList.remove('hidden');
      isValid = false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      document.getElementById('email-error').classList.remove('hidden');
      isValid = false;
    } else {
      document.getElementById('email-error').classList.add('hidden');
      userData.email = emailInput.value.trim();
    }
    
    // Validar esporte
    if (!sportInput.value.trim()) {
      document.getElementById('sport-error').classList.remove('hidden');
      isValid = false;
    } else {
      document.getElementById('sport-error').classList.add('hidden');
      userData.sport = sportInput.value.trim();
    }
    
    // Validar altura
    if (!heightInput.value || heightInput.value < 50 || heightInput.value > 250) {
      document.getElementById('height-error').classList.remove('hidden');
      isValid = false;
    } else {
      document.getElementById('height-error').classList.add('hidden');
      userData.height = heightInput.value;
    }
    
    // Validar peso
    if (!weightInput.value || weightInput.value < 20 || weightInput.value > 300) {
      document.getElementById('weight-error').classList.remove('hidden');
      isValid = false;
    } else {
      document.getElementById('weight-error').classList.add('hidden');
      userData.weight = weightInput.value;
    }
    
    // Se todos os campos forem válidos, iniciar o chat
    if (isValid) {
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
      const initialMessage = `Olá ${userData.name}! Sou seu assistente da Future Athlete. Vejo que você pratica ${userData.sport} e tem ${userData.height}cm de altura e ${userData.weight}kg. Como posso ajudar a melhorar seu desempenho e carreira esportiva hoje?`;
      
      // Adicionar ao histórico
      messageHistory.push({ role: "assistant", content: initialMessage });
      
      // Mostrar mensagem com animação de escrita
      addAIMessage(initialMessage);
    }
  });
  
// Função para gerar PDF
function generatePDF(conversation) {
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
  
  // Função para adicionar mensagem do usuário ao chat
  function addUserMessage(message) {
    const userBubble = document.createElement('div');
    userBubble.className = 'flex justify-end';
    userBubble.innerHTML = `
      <div class="chat-bubble bg-green-400 bg-opacity-30 p-2 sm:p-3 max-w-[90%]">
        <p class="text-xs sm:text-sm md:text-base text-white">${message}</p>
      </div>
    `;
    chatContainer.appendChild(userBubble);
    
    // Adicionar ao histórico
    messageHistory.push({ role: "user", content: message });
    
    // Scroll para o final
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  // Função para adicionar mensagem da IA ao chat com animação de escrita
  function addAIMessage(message) {
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble bg-gray-800 p-2 sm:p-3 max-w-[90%] mx-auto';
    
    // Criar elemento para a animação de escrita
    const typedElement = document.createElement('div');
    typedElement.className = 'markdown text-xs sm:text-sm md:text-base text-white';
    aiBubble.appendChild(typedElement);
    
    chatContainer.appendChild(aiBubble);
    
    // Converter Markdown para HTML
    const formattedMessage = DOMPurify.sanitize(marked.parse(message));
    
    // Iniciar animação de escrita com velocidade aumentada
    new Typed(typedElement, {
      strings: [formattedMessage],
      typeSpeed: 3, // Velocidade ainda mais rápida
      showCursor: true,
      cursorChar: '|',
      onStringTyped: function() {
        scrollToBottom(); // Scroll a cada caractere digitado
      },
      onComplete: function() {
        setTimeout(() => {
          const cursor = aiBubble.querySelector('.typed-cursor');
          if (cursor) cursor.remove();
          scrollToBottom();
        }, 500);
      }
    });
    
    // Adicionar ao histórico
    messageHistory.push({ role: "assistant", content: message });
    
    // Configurar intervalo para scroll contínuo durante a digitação
    const scrollInterval = setInterval(() => {
      scrollToBottom();
    }, 100);
    
    // Limpar o intervalo após a conclusão da animação
    setTimeout(() => {
      clearInterval(scrollInterval);
    }, message.length * 3 + 1000); // Estimativa de tempo baseada na velocidade de digitação
  }
  
  // Função para mostrar indicador de digitação
  function showTypingIndicator() {
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
    return typingIndicator;
  }
  
  // Função para enviar mensagem para a API do Groq
  async function sendToGroq(userMessage) {
    const typingIndicator = showTypingIndicator();
    
    try {
      // Primeiro, tenta usar o modelo meta-llama/llama-4-maverick-17b-128e-instruct
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct", // Primeiro modelo a ser tentado
          messages: messageHistory,
          max_tokens: 8192,
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      
      // Verificar se houve erro com o primeiro modelo
      if (data.error) {
        console.warn('Error with llama-4-maverick model, falling back to llama-3.1-8b-instant:', data.error);
        
        // Tentar com o modelo de fallback
        const fallbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant", // Modelo de fallback
            messages: messageHistory,
            max_tokens: 8192,
            temperature: 0.7
          })
        });
        
        const fallbackData = await fallbackResponse.json();
        
        // Remover indicador de digitação
        typingIndicator.remove();
        
        if (fallbackData.choices && fallbackData.choices[0] && fallbackData.choices[0].message) {
          const aiResponse = fallbackData.choices[0].message.content;
          addAIMessage(aiResponse);
          processFinalResponse(aiResponse);
        } else {
          handleApiError(fallbackData);
        }
      } else {
        // Remover indicador de digitação
        typingIndicator.remove();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const aiResponse = data.choices[0].message.content;
          addAIMessage(aiResponse);
          processFinalResponse(aiResponse);
        } else {
          handleApiError(data);
        }
      }
    } catch (error) {
      // Remover indicador de digitação
      typingIndicator.remove();
      
      console.error('Error calling Groq API:', error);
      addAIMessage("Desculpe, houve um erro ao conectar com meu cérebro. Por favor, tente novamente mais tarde.");
    }
  }
  
  // Função para processar a resposta final e mostrar PDF e botões
  function processFinalResponse(aiResponse) {
    // Após a resposta, gerar PDF e mostrar botão de download
    setTimeout(() => {
      // Esconder área de input
      chatInputArea.style.display = 'none';
      
      // Gerar PDF
      const pdfUrl = generatePDF(aiResponse);
      
      // Adicionar mensagem com botão de download
      const pdfMessage = document.createElement('div');
      pdfMessage.className = 'chat-bubble bg-gray-800 p-2 sm:p-3 max-w-[90%] mx-auto pdf-message';
      pdfMessage.innerHTML = `
        <p class="text-xs sm:text-sm md:text-base text-gray-600 mb-2"><b class="text-green-700">Seu plano de carreira personalizado está pronto!</b> Lembre-se que para alcançar seus objetivos, você nunca conseguirá fazer tudo sozinho. Em algum momento, você precisará de ajuda profissional.</p>
        <div class="flex flex-col sm:flex-row gap-2">
          <a href="${pdfUrl}" download="plano_carreira_${userData.name.replace(/\s+/g, '_')}.pdf" class="pdf-button inline-flex items-center bg-green-400 text-black px-3 py-1 rounded-full text-xs font-bold transition duration-300">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Baixar PDF
          </a>
          <a href="#plans" class="plan-button inline-flex items-center bg-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold transition duration-300">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            Conhecer Nossos Planos
          </a>
        </div>
      `;
      
      // Adicionar estilos para animação
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        
        .pdf-message {
          animation: fadeInUp 0.6s ease-out forwards;
          position: relative;
          overflow: hidden;
        }
        
        .pdf-message::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s ease-in-out 1;
          pointer-events: none;
          z-index: 1;
        }
        
        .pdf-message::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(0, 255, 136, 0.15) 0%,
            rgba(0, 0, 0, 0) 70%
          );
          opacity: 0;
          animation: glow 1.5s ease-in-out 0.3s forwards;
          pointer-events: none;
          z-index: 1;
        }
        
        @keyframes glow {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .pdf-button:hover {
          background-color: #00e67a;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 230, 122, 0.3);
        }
        
        .plan-button:hover {
          background-color: #ff9933;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(255, 153, 51, 0.3);
        }
      `;
      
      // Adicionar o estilo ao documento
      document.head.appendChild(style);
      
      // Adicionar a mensagem ao chat
      chatContainer.appendChild(pdfMessage);
      
      // Marcar que o usuário já usou o chat gratuito
      localStorage.setItem('hasUsedFreeChat', 'false');
      
      // Scroll para o final
      scrollToBottom();
    }, 3000);
  }
  
  // Função para lidar com erros da API
  function handleApiError(data) {
    addAIMessage("Desculpe, não consegui gerar uma resposta no momento. Por favor, tente novamente.");
    console.error('Unexpected API response:', data);
  }
  
  // Função para rolar suavemente até a seção de planos
  function scrollToPlans() {
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Caso não encontre o ID específico, tenta rolar para uma seção alternativa
      const alternativeSections = ['pricing', 'subscription', 'membership'];
      for (const sectionId of alternativeSections) {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          break;
        }
      }
    }
  }
  
  // Event listener para o botão de enviar
  sendButton.addEventListener('click', function() {
    const userMessage = textarea.value.trim();
    if (userMessage) {
      addUserMessage(userMessage);
      textarea.value = '';
      sendToGroq(userMessage);
    }
  });
  
  // Event listener para pressionar Enter no textarea
  textarea.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });
  
  // Verificar se o usuário já usou o chat gratuito
  if (hasUsedFreeChat) {
    const limitMessage = document.createElement('div');
    limitMessage.className = 'bg-gray-800 rounded-xl p-3 max-w-lg mx-auto text-center mb-4';
    limitMessage.innerHTML = `
      <p class="text-yellow-400 font-bold mb-2">Você já utilizou seu plano gratuito</p>
      <p class="text-xs sm:text-sm text-gray-300">Para continuar recebendo planos personalizados e acompanhamento profissional, conheça nossa plataforma completa.</p>
      <button class="mt-3 bg-green-400 text-black px-4 py-2 rounded-xl font-bold hover:bg-green-300 transition duration-300 w-full">Conhecer Plataforma</button>
    `;
    userForm.parentNode.insertBefore(limitMessage, userForm);
    userForm.style.display = 'none';
  }
  // Função para scroll automático durante a digitação
  function scrollToBottom() {
    const chatArea = document.getElementById('chat-area');
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  });
