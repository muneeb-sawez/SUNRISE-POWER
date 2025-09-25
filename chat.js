    class ChatBot {
        constructor() {
            // Configuration - IMPORTANT: Add your Gemini API key here
            this.config = {
                // Replace with your actual Gemini API key
                apiKey: 'AIzaSyCWH68YxIUTvfCBNDiL-iPg_91F0n6d_m0', 
                apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
                
                // System prompt to define bot behavior
                systemPrompt: `You are a helpful, professional, and friendly AI assistant for a company website. Here are your guidelines:

**Personality & Tone:**
- Be warm, professional, and approachable
- Use a conversational but respectful tone
- Be concise but helpful in your responses
- Show enthusiasm for helping users

**Capabilities:**
- Answer general questions about the company and services
- Provide customer support and guidance
- Help with product inquiries and recommendations
- Assist with technical questions when possible
- Direct users to appropriate resources or human agents when needed

**Behavior Rules:**
- Always be polite and patient
- If you don't know something, admit it and offer to help find the information
- Keep responses focused and relevant
- Ask clarifying questions when user requests are unclear
- Maintain user privacy and don't ask for sensitive information
- For complex issues, suggest contacting human support

**Response Style:**
- Use bullet points for lists when helpful
- Include relevant emojis occasionally to be friendly (but not excessive)
- Provide actionable advice when possible
- End responses with a question to continue the conversation when appropriate

Remember: You represent the company, so maintain professionalism while being helpful and human-like.
When responding to users asking for solar panel recommendations for a specific city like Mumbai, the chatbot should reply in this structured format:



"Hello! I'd be happy to help you choose a solar panel suitable for . 😊 To give you the best recommendation, I need a little more information. Could you tell me:

What is the size of your roof/available space? This helps determine the number of panels you can install.

What is your approximate energy consumption? (kWh per month) This helps determine the system size you'll need.

What is your budget? Solar panel systems vary in price.

Are you interested in on-grid, off-grid, or hybrid system? This impacts the type of panel and associated equipment.

Once I have this information, I can provide you with more specific recommendations for solar panels that are well-suited to the climate and energy needs in Mumbai. We have a range of high-quality panels from leading manufacturers.

In the meantime, you might find our "Choosing the Right Solar Panel" guide helpful – you can find it on our website.

Looking forward to hearing from you so I can assist further!

Connect with Sunrise Power:
Instagram: @sunrise_power_official
Facebook: Sunrise Power
YouTube: SunrisePower2all
Email: sunrisepower2all@gmail.com"`,

                // Welcome message configuration
                welcomeMessage: {
                    title: "👋 Welcome!",
                    message: "Hi there! I'm an AI assistant. How can I help you today?",
                    showIcon: true,
                    autoSend: true 
                }
            };
            
            this.isOpen = false;
            this.conversationHistory = [];
            this.isProcessing = false;
            
            this.initializeElements();
            this.attachEventListeners();
            this.adjustTextareaHeight();
            this.checkApiKey();
            this.initializeWelcomeMessage();
        }

        initializeElements() {
            this.chatButton = document.getElementById('chatButton');
            this.chatOverlay = document.getElementById('chatOverlay');
            this.chatModal = document.getElementById('chatModal');
            this.closeBtn = document.getElementById('closeBtn');
            this.chatMessages = document.getElementById('chatMessages');
            this.messageInput = document.getElementById('messageInput');
            this.sendBtn = document.getElementById('sendBtn');
            this.typingIndicator = document.getElementById('typingIndicator');
        }

        attachEventListeners() {
            this.chatButton.addEventListener('click', () => this.toggleChat());
            this.closeBtn.addEventListener('click', () => this.closeChat());
            this.chatOverlay.addEventListener('click', () => this.closeChat());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            
            this.messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.messageInput.addEventListener('input', () => {
                this.adjustTextareaHeight();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeChat();
                }
            });
        }
        
        initializeWelcomeMessage() {
            this.welcomeMessageShown = false;
        }

        showWelcomeMessage() {
            if (this.welcomeMessageShown || !this.config.welcomeMessage) return;
            
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'welcome-message';
            
            let iconSvg = '';
            if (this.config.welcomeMessage.showIcon) {
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
            }
            
            welcomeDiv.innerHTML = `${iconSvg}<h4>${this.config.welcomeMessage.title}</h4><p>${this.config.welcomeMessage.message}</p>`;
            
            this.chatMessages.insertBefore(welcomeDiv, this.typingIndicator);
            this.welcomeMessageShown = true;
            
            if (this.config.welcomeMessage.autoSend) {
                setTimeout(() => {
                    this.addMessage(this.config.welcomeMessage.message, 'bot');
                }, 1000);
            }
        }

        checkApiKey() {
            if (this.config.apiKey === 'YOUR_GEMINI_API_KEY_HERE' || !this.config.apiKey) {
                this.showApiNotice();
            }
        }

        showApiNotice() {
            const noticeDiv = document.createElement('div');
            noticeDiv.className = 'api-notice';
            noticeDiv.innerHTML = `<strong>Setup Required:</strong> Please add your Gemini API key in the JavaScript code to start chatting.`;
            this.chatMessages.insertBefore(noticeDiv, this.typingIndicator);
        }

        toggleChat() {
            this.isOpen ? this.closeChat() : this.openChat();
        }

        openChat() {
            this.isOpen = true;
            this.chatButton.classList.add('active');
            this.chatOverlay.classList.add('active');
            
            this.chatModal.style.display = 'flex';
            setTimeout(() => this.chatModal.classList.add('active'), 10);
            
            setTimeout(() => this.showWelcomeMessage(), 500);
            
            setTimeout(() => this.messageInput.focus(), 800);

            const badge = this.chatButton.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
        }

        closeChat() {
            this.isOpen = false;
            this.chatButton.classList.remove('active');
            this.chatOverlay.classList.remove('active');
            this.chatModal.classList.remove('active');
            
            setTimeout(() => {
                if (!this.isOpen) this.chatModal.style.display = 'none';
            }, 300);
        }

        adjustTextareaHeight() {
            const textarea = this.messageInput;
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 100);
            textarea.style.height = `${newHeight}px`;
        }

        async sendMessage() {
            const message = this.messageInput.value.trim();
            if (!message || this.isProcessing) return;

            if (!this.isValidApiKey()) {
                this.showError('Please configure your Gemini API key in the code.');
                return;
            }

            this.addMessage(message, 'user');
            this.messageInput.value = '';
            this.adjustTextareaHeight();
            this.setProcessingState(true);
            this.showTypingIndicator();

            try {
                const response = await this.callGeminiAPI(message);
                this.hideTypingIndicator();
                if (response) {
                    this.addMessage(response, 'bot');
                } else {
                    throw new Error('Empty response from API');
                }
            } catch (error) {
                console.error('Chatbot Error:', error);
                this.hideTypingIndicator();
                this.handleError(error);
            } finally {
                this.setProcessingState(false);
            }
        }

        isValidApiKey() {
            return this.config.apiKey && this.config.apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
        }

        async callGeminiAPI(message) {
            const contents = [];

            // Add system prompt and conversation history
            if (this.conversationHistory.length === 0 && this.config.systemPrompt) {
                 contents.push({
                    role: "user",
                    parts: [{ text: this.config.systemPrompt + "\n\nUser: " + message }]
                });
            } else {
                 // Add recent conversation history for context
                const recentHistory = this.conversationHistory.slice(-12); // Last 6 user-bot exchanges
                for (let i = 0; i < recentHistory.length; i += 2) {
                    if (recentHistory[i] && recentHistory[i + 1]) {
                        contents.push({ role: "user", parts: [{ text: recentHistory[i] }] });
                        contents.push({ role: "model", parts: [{ text: recentHistory[i + 1] }] });
                    }
                }
                contents.push({ role: "user", parts: [{ text: message }] });
            }

            const requestBody = {
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
            };

            const response = await fetch(`${this.config.apiUrl}?key=${this.config.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content) {
                const botResponse = data.candidates[0].content.parts[0].text;
                this.conversationHistory.push(message, botResponse);
                if (this.conversationHistory.length > 20) {
                    this.conversationHistory = this.conversationHistory.slice(-20);
                }
                return botResponse;
            } else if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
                throw new Error('Response was blocked due to safety filters.');
            } else {
                throw new Error('No valid response received from the API');
            }
        }

        addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            const textNode = document.createTextNode(text);
            contentDiv.appendChild(textNode);
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
            contentDiv.appendChild(timeDiv);
            
            messageDiv.appendChild(contentDiv);
            this.chatMessages.insertBefore(messageDiv, this.typingIndicator);
            this.scrollToBottom();
        }

        handleError(error) {
            let errorMessage = 'I apologize, but I encountered an error. Please try again.';
            if (error.message.includes('API Error 400')) {
                 errorMessage = 'Invalid API key. Please check your Gemini API key configuration.';
            } else if (error.message.includes('safety filters')) {
                errorMessage = error.message;
            }
            this.showError(errorMessage);
        }

        showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            this.chatMessages.insertBefore(errorDiv, this.typingIndicator);
            this.scrollToBottom();
        }

        showTypingIndicator() {
            this.typingIndicator.style.display = 'block';
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            this.typingIndicator.style.display = 'none';
        }

        setProcessingState(processing) {
            this.isProcessing = processing;
            this.messageInput.disabled = processing;
            this.sendBtn.disabled = processing;
            if (processing) {
                this.sendBtn.style.opacity = '0.6';
            } else {
                this.sendBtn.style.opacity = '1';
                this.messageInput.focus();
            }
        }

        scrollToBottom() {
            setTimeout(() => {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }, 100);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.chatbot = new ChatBot();
    });
    