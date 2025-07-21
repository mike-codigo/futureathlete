// Integração WhatsApp - Future Athlete
// Solução para problemas de CORS e compatibilidade

class WhatsAppIntegration {
  constructor() {
    this.config = {
      apiKey: '626FBF6D06C4-424C-998F-88A2DC5ED1C6',
      instance: 'Muvi Company',
      baseUrl: 'https://evolution.murilosilva.com'
    };
  }

  // Gerar mensagem personalizada
  async generatePersonalizedMessage(userData) {
    try {
      const messagePrompt = `Crie uma mensagem personalizada e motivacional para WhatsApp para ${userData.name}, que pratica ${userData.sport}, tem ${userData.height}cm de altura e ${userData.weight}kg. 

      A mensagem deve:
      1. Ser calorosa e pessoal
      2. Mencionar o esporte específico
      3. Ser motivacional e inspiradora
      4. Explicar que o plano de carreira foi criado especialmente para ele/ela
      5. Incluir emojis apropriados
      6. Ter no máximo 200 palavras
      7. Terminar convidando para conhecer mais sobre a Future Athlete
      8. Incluir valores cristãos de forma sutil (fé, perseverança, dedicação)
      
      Responda APENAS com a mensagem, sem explicações adicionais.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Você é um especialista em comunicação esportiva e marketing digital. Crie mensagens personalizadas e motivacionais." },
            { role: "user", content: messagePrompt }
          ],
          max_tokens: 300,
          temperature: 0.8
        })
      });

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else {
        return this.getDefaultMessage(userData);
      }
    } catch (error) {
      console.error('Erro ao gerar mensagem personalizada:', error);
      return this.getDefaultMessage(userData);
    }
  }

  // Mensagem padrão caso a API falhe
  getDefaultMessage(userData) {
    return `Olá ${userData.name}! 🏆

Seu plano de carreira personalizado para ${userData.sport} está pronto! 💪

Criamos estratégias específicas considerando seu perfil (${userData.height}cm, ${userData.weight}kg) para maximizar seu potencial atlético.

Lembre-se: o sucesso vem através da fé, dedicação e perseverança. Cada treino é um passo em direção aos seus sonhos! 🌟

Conheça mais sobre a Future Athlete e como podemos acelerar sua carreira esportiva!

#FutureAthlete #CarreiraEsportiva`;
  }

  // Método principal para enviar via WhatsApp
  async sendToWhatsApp(userData, pdfUrl) {
    try {
      console.log('🚀 Iniciando envio WhatsApp para:', userData.phone);

      // Gerar mensagem personalizada
      const personalizedMessage = await this.generatePersonalizedMessage(userData);
      console.log('📝 Mensagem gerada, tamanho:', personalizedMessage.length, 'caracteres');

      // Limpar número de telefone
      let cleanPhone = userData.phone.replace(/\D/g, '');
      if (!cleanPhone.startsWith('55')) {
        cleanPhone = '55' + cleanPhone;
      }
      console.log('📞 Número formatado:', cleanPhone);

      // Tentar múltiplos métodos
      const methods = [
        () => this.sendViaEvolutionAPI(cleanPhone, personalizedMessage, pdfUrl),
        () => this.sendViaDirectLink(cleanPhone, personalizedMessage),
        () => this.sendViaWebAPI(cleanPhone, personalizedMessage)
      ];

      for (const method of methods) {
        try {
          console.log('🔄 Tentando método:', method.name);
          const result = await method();
          if (result.success) {
            console.log('✅ Sucesso com método:', result.method);
            return { success: true, method: result.method };
          }
        } catch (error) {
          console.log('❌ Método falhou, tentando próximo...', error.message);
          continue;
        }
      }

      // Se todos os métodos falharam, mostrar opção manual
      console.log('📱 Todos os métodos automáticos falharam, usando opção manual');
      return this.showManualOption(cleanPhone, personalizedMessage);

    } catch (error) {
      console.error('❌ Erro geral no envio WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }

  // Função de teste específica para debug
  async testPDFSending(userData, pdfUrl) {
    console.log('🧪 MODO TESTE - Enviando PDF via WhatsApp');

    try {
      const personalizedMessage = await this.generatePersonalizedMessage(userData);
      let cleanPhone = userData.phone.replace(/\D/g, '');
      if (!cleanPhone.startsWith('55')) {
        cleanPhone = '55' + cleanPhone;
      }

      // Testar apenas o envio do PDF
      console.log('📄 Testando envio específico do PDF...');
      const pdfResult = await this.sendPDFFile(cleanPhone, pdfUrl);

      return {
        success: pdfResult,
        method: 'PDF Test',
        details: {
          phone: cleanPhone,
          messageLength: personalizedMessage.length,
          pdfUrl: pdfUrl
        }
      };
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      return { success: false, error: error.message };
    }
  }

  // Método 1: Evolution API (original) - Agora com envio de arquivo
  async sendViaEvolutionAPI(phone, message, pdfUrl) {
    try {
      console.log('Tentando enviar via Evolution API...');

      // Primeiro, enviar a mensagem de texto
      const textSuccess = await this.sendTextMessage(phone, message);

      // Se temos PDF, aguardar um pouco e tentar enviar o arquivo
      let fileSuccess = false;
      if (pdfUrl) {
        console.log('Aguardando 3 segundos antes de enviar o PDF...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        fileSuccess = await this.sendPDFFile(phone, pdfUrl);
      }

      if (textSuccess || fileSuccess) {
        return { success: true, method: 'Evolution API' };
      }

      throw new Error('Falha ao enviar mensagem e arquivo');
    } catch (error) {
      throw new Error(`Evolution API: ${error.message}`);
    }
  }

  // Enviar mensagem de texto
  async sendTextMessage(phone, message) {
    const textEndpoints = [
      `/message/sendText/${encodeURIComponent(this.config.instance)}`,
      `/sendText/${encodeURIComponent(this.config.instance)}`,
      `/api/sendText`,
      `/sendMessage`
    ];

    for (const endpoint of textEndpoints) {
      try {
        const payload = {
          number: phone,
          text: message,
          textMessage: { text: message },
          message: message
        };

        const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.config.apiKey,
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          console.log('✅ Mensagem de texto enviada:', endpoint);
          return true;
        }
      } catch (error) {
        console.log('❌ Endpoint de texto falhou:', endpoint, error.message);
        continue;
      }
    }

    return false;
  }

  // Enviar arquivo PDF
  async sendPDFFile(phone, pdfUrl) {
    try {
      console.log('🔄 Processando PDF para envio...', pdfUrl);

      let pdfBlob;
      let base64PDF;

      // Primeiro, obter o blob do PDF
      if (pdfUrl.startsWith('blob:')) {
        console.log('📄 Convertendo blob URL para base64...');
        const pdfResponse = await fetch(pdfUrl);
        pdfBlob = await pdfResponse.blob();
      } else {
        console.log('🌐 Baixando PDF de URL externa...');
        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok) {
          throw new Error(`Falha ao baixar PDF: ${pdfResponse.status}`);
        }
        pdfBlob = await pdfResponse.blob();
      }

      // Verificar se é realmente um PDF
      console.log('📋 Tipo do arquivo:', pdfBlob.type);
      console.log('📏 Tamanho do blob PDF:', pdfBlob.size, 'bytes');

      if (pdfBlob.size === 0) {
        throw new Error('PDF está vazio (0 bytes)');
      }

      if (pdfBlob.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('PDF muito grande (máximo 10MB)');
      }

      // Converter blob para base64 com validação mais robusta
      base64PDF = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          try {
            const result = reader.result;
            if (!result || typeof result !== 'string') {
              reject(new Error('Resultado da leitura é inválido'));
              return;
            }

            // Verificar se tem o prefixo correto
            if (!result.startsWith('data:')) {
              reject(new Error('Resultado não é um data URL válido'));
              return;
            }

            // Extrair apenas o base64 (sem o prefixo data:application/pdf;base64,)
            const base64String = result.split(',')[1];

            if (!base64String || base64String.length < 100) {
              reject(new Error('Base64 extraído está vazio ou muito pequeno'));
              return;
            }

            // Validar se é base64 válido
            try {
              atob(base64String.substring(0, 100)); // Testar decodificação de uma parte
            } catch (e) {
              reject(new Error('Base64 gerado não é válido'));
              return;
            }

            console.log('✅ PDF convertido para base64, tamanho:', base64String.length, 'caracteres');
            resolve(base64String);
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => reject(new Error('Erro ao ler o arquivo PDF'));
        reader.readAsDataURL(pdfBlob);
      });

      // Usar apenas o endpoint correto da Evolution API
      const fileEndpoints = [
        `/message/sendMedia/${encodeURIComponent(this.config.instance)}`
      ];

      for (const endpoint of fileEndpoints) {
        try {
          // Formato correto que funcionou nos testes
          const payloads = [
            // Formato 1: Formato correto da Evolution API (testado e funcionando)
            {
              number: phone,
              mediatype: "document",
              fileName: "plano_carreira_futureathlete.pdf",
              media: base64PDF
            }
          ];

          for (const payload of payloads) {
            try {
              console.log(`Tentando enviar arquivo via ${endpoint} com payload tipo ${payloads.indexOf(payload) + 1}...`);

              // Log detalhado do payload (mascarando apenas o base64)
              const logPayload = JSON.parse(JSON.stringify(payload));
              if (logPayload.mediaMessage && logPayload.mediaMessage.media) {
                logPayload.mediaMessage.media = `[BASE64 DATA - ${logPayload.mediaMessage.media.length} chars]`;
              }
              if (logPayload.media) {
                logPayload.media = `[BASE64 DATA - ${logPayload.media.length} chars]`;
              }
              if (logPayload.base64) {
                logPayload.base64 = `[BASE64 DATA - ${logPayload.base64.length} chars]`;
              }

              console.log('📤 Payload completo sendo enviado:', JSON.stringify(logPayload, null, 2));

              // Verificar especificamente se mediatype está presente
              if (payload.mediaMessage && payload.mediaMessage.mediatype) {
                console.log('✅ mediatype encontrado:', payload.mediaMessage.mediatype);
              } else {
                console.log('❌ mediatype NÃO encontrado no payload!');
              }

              const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': this.config.apiKey,
                  'Authorization': `Bearer ${this.config.apiKey}`,
                  'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
              });

              console.log(`Resposta do servidor: ${response.status} - ${response.statusText}`);

              if (response.ok) {
                const responseData = await response.json();
                console.log('✅ PDF enviado com sucesso!', responseData);
                return true;
              } else {
                const errorData = await response.text();
                console.log('❌ Erro na resposta:', errorData);

                // Tentar parsear o erro para mais detalhes
                try {
                  const errorJson = JSON.parse(errorData);
                  console.log('❌ Detalhes do erro:', errorJson);
                } catch (e) {
                  console.log('❌ Erro não é JSON válido');
                }
              }
            } catch (payloadError) {
              console.log('❌ Erro com payload:', payloadError.message);
              continue;
            }
          }
        } catch (endpointError) {
          console.log('❌ Endpoint de arquivo falhou:', endpoint, endpointError.message);
          continue;
        }
      }

      console.log('❌ Todos os métodos de envio de arquivo falharam');
      return false;
    } catch (error) {
      console.error('❌ Erro ao enviar PDF:', error);
      return false;
    }
  }

  // Método 2: Link direto do WhatsApp
  async sendViaDirectLink(phone, message) {
    try {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

      // Abrir em nova aba
      window.open(whatsappUrl, '_blank');

      return { success: true, method: 'Direct Link' };
    } catch (error) {
      throw new Error(`Direct Link: ${error.message}`);
    }
  }

  // Método 3: Web API do WhatsApp (se disponível)
  async sendViaWebAPI(phone, message) {
    try {
      // Verificar se o navegador suporta Web Share API
      if (navigator.share) {
        await navigator.share({
          title: 'Future Athlete - Plano de Carreira',
          text: message,
          url: window.location.href
        });
        return { success: true, method: 'Web Share API' };
      }

      throw new Error('Web Share API não disponível');
    } catch (error) {
      throw new Error(`Web API: ${error.message}`);
    }
  }

  // Opção manual quando todos os métodos falham
  showManualOption(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    return {
      success: false,
      manual: true,
      whatsappUrl: whatsappUrl,
      message: message,
      phone: phone
    };
  }

  // Criar elemento visual para opção manual
  createManualElement(whatsappUrl, message) {
    const manualBubble = document.createElement('div');
    manualBubble.className = 'chat-bubble bg-blue-600 bg-opacity-20 p-3 max-w-[90%] mx-auto manual-whatsapp';
    manualBubble.innerHTML = `
      <div class="flex flex-col items-center text-blue-400">
        <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p class="text-sm mb-3 text-center font-semibold">📱 Envie seu plano via WhatsApp</p>
        <p class="text-xs mb-4 text-center text-gray-300">Clique no botão abaixo para abrir o WhatsApp com sua mensagem personalizada:</p>
        <a href="${whatsappUrl}" target="_blank" class="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-full text-sm font-bold transition duration-300 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          Abrir WhatsApp
        </a>
        <div class="mt-4 p-3 bg-gray-800 rounded-lg max-w-full">
          <p class="text-xs text-gray-400 mb-2">Prévia da mensagem:</p>
          <p class="text-xs text-gray-200 whitespace-pre-wrap overflow-hidden">${message.substring(0, 150)}${message.length > 150 ? '...' : ''}</p>
        </div>
      </div>
    `;

    return manualBubble;
  }

  // Criar elemento de sucesso
  createSuccessElement(method) {
    const successBubble = document.createElement('div');
    successBubble.className = 'chat-bubble bg-green-600 bg-opacity-20 p-3 max-w-[90%] mx-auto';
    successBubble.innerHTML = `
      <div class="flex flex-col items-center text-green-400">
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="text-sm font-semibold">✅ Enviado com sucesso via ${method}!</p>
        </div>
        <div class="flex items-center space-x-4 text-xs">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span>Mensagem</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>PDF Anexo</span>
          </div>
        </div>
      </div>
    `;
    return successBubble;
  }

  // Criar elemento de erro
  createErrorElement() {
    const errorBubble = document.createElement('div');
    errorBubble.className = 'chat-bubble bg-red-600 bg-opacity-20 p-3 max-w-[90%] mx-auto';
    errorBubble.innerHTML = `
      <div class="flex items-center text-red-400">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-sm">⚠️ Não foi possível enviar automaticamente. Use a opção manual acima ou baixe o PDF.</p>
      </div>
    `;
    return errorBubble;
  }
}

// Exportar para uso global
window.WhatsAppIntegration = WhatsAppIntegration;