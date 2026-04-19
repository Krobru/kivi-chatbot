// Kivi Chatbot - Client AI-Powered
// Connects to backend server with OpenAI API

class KiviChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.language = this.detectLanguage();
    this.conversationId = this.generateConversationId();
    this.isLoading = false;
    this.apiUrl = this.getApiUrl();
    
    this.translations = {
      fr: {
        greeting: "Bonjour! Je suis Kivi, l'assistant IA intelligent de KV Smart. Posez-moi n'importe quelle question sur nos services, notre entreprise ou vos projets!",
        placeholder: "Posez une question...",
        loading: "⏳ Kivi réfléchit...",
        error: "Une erreur s'est produite. Veuillez réessayer.",
        connectionError: "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
      },
      en: {
        greeting: "Hello! I'm Kivi, KV Smart's intelligent AI assistant. Ask me anything about our services, company, or your projects!",
        placeholder: "Ask a question...",
        loading: "⏳ Kivi is thinking...",
        error: "An error occurred. Please try again.",
        connectionError: "Unable to connect to the server. Check your internet connection."
      }
    };
    
    this.init();
  }

    this.init();
  }

  getApiUrl() {
    const hostname = window.location.hostname;
    
    // Développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    
    // Production Netlify (fonction serverless)
    if (hostname.includes('netlify.app')) {
      return '/.netlify/functions/chatbot';
    }
    
    // Production avec Render backend (URL à mettre à jour)
    // Format: https://your-app-name.onrender.com/api
    return `${window.location.protocol}//${window.location.host.replace('netlify.app', 'onrender.com')}/api`;
  }

  detectLanguage() {
    return document.documentElement.lang === 'en' ? 'en' : 'fr';
  }

  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getText(key) {
    return this.translations[this.language][key] || this.translations['fr'][key];
  }

  init() {
    this.createChatbot();
    this.attachEventListeners();
    this.addMessage('bot', this.getText('greeting'));
  }

  createChatbot() {
    const chatbotHTML = `
      <div id="kivi-chatbot" class="fixed bottom-6 right-6 z-50">
        <div id="kivi-chat-window" class="hidden absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-kv-navy to-kv-turquoise text-white p-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">🤖</span>
              <div>
                <h3 class="font-bold">Kivi Assistant</h3>
                <p class="text-xs opacity-90">Alimenté par IA</p>
              </div>
            </div>
            <button id="kivi-close-btn" class="text-white hover:opacity-80 text-xl">✕</button>
          </div>
          <div id="kivi-messages" class="h-96 overflow-y-auto p-4 bg-gray-50 space-y-3 scrollbar-thin scrollbar-thumb-kv-lime scrollbar-track-gray-200">
          </div>
          <div class="bg-white border-t p-3 flex gap-2">
            <input 
              type="text" 
              id="kivi-input" 
              placeholder="${this.getText('placeholder')}" 
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kv-lime transition disabled:opacity-50"
            >
            <button 
              id="kivi-send-btn" 
              class="bg-kv-lime text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↑
            </button>
          </div>
        </div>
        <button 
          id="kivi-toggle-btn" 
          class="w-14 h-14 bg-gradient-to-br from-kv-lime to-kv-turquoise text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center text-2xl hover:scale-110 relative"
        >
          🤖
          <span id="kivi-notification" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
        </button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('kivi-toggle-btn');
    const closeBtn = document.getElementById('kivi-close-btn');
    const sendBtn = document.getElementById('kivi-send-btn');
    const input = document.getElementById('kivi-input');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isLoading) this.sendMessage();
    });
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    const chatWindow = document.getElementById('kivi-chat-window');
    chatWindow.classList.remove('hidden');
    this.isOpen = true;
    document.getElementById('kivi-input').focus();
    this.hideNotification();
  }

  closeChat() {
    const chatWindow = document.getElementById('kivi-chat-window');
    chatWindow.classList.add('hidden');
    this.isOpen = false;
  }

  hideNotification() {
    const notification = document.getElementById('kivi-notification');
    if (notification) notification.classList.add('hidden');
  }

  showNotification() {
    if (!this.isOpen) {
      const notification = document.getElementById('kivi-notification');
      if (notification) notification.classList.remove('hidden');
    }
  }

  async sendMessage() {
    const input = document.getElementById('kivi-input');
    const message = input.value.trim();

    if (!message || this.isLoading) return;

    this.isLoading = true;
    this.addMessage('user', message);
    input.value = '';
    input.disabled = true;
    
    document.getElementById('kivi-send-btn').disabled = true;

    try {
      const response = await fetch(`${this.apiUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          conversationId: this.conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        this.addMessage('bot', data.message);
        this.showNotification();
      } else {
        this.addMessage('bot', data.error || this.getText('error'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      let errorMsg = this.getText('error');
      
      if (error instanceof TypeError) {
        errorMsg = this.getText('connectionError');
      }
      
      this.addMessage('bot', errorMsg);
    } finally {
      this.isLoading = false;
      input.disabled = false;
      document.getElementById('kivi-send-btn').disabled = false;
      input.focus();
    }
  }

  addMessage(sender, text) {
    const messagesContainer = document.getElementById('kivi-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex gap-2 animate-fadeIn';

    if (sender === 'user') {
      messageDiv.className += ' justify-end';
      messageDiv.innerHTML = `
        <div class="bg-kv-lime text-white rounded-lg p-3 shadow-sm max-w-xs text-sm">
          <p>${this.escapeHtml(text)}</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-kv-turquoise flex items-center justify-center text-white text-sm flex-shrink-0">👤</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-kv-navy flex items-center justify-center text-white text-sm flex-shrink-0">🤖</div>
        <div class="bg-white rounded-lg p-3 shadow-sm max-w-xs text-sm border border-gray-200">
          <p>${this.formatResponse(text)}</p>
        </div>
      `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatResponse(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
}

// Initialiser le chatbot quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new KiviChatbot();
  });
} else {
  new KiviChatbot();
}
