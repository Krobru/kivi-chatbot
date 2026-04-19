// Configuration des URLs pour les environnements
// Changez RENDER_URL par votre URL Render réelle
export const API_CONFIG = {
  // Développement local
  development: {
    api: 'http://localhost:3001/api'
  },
  
  // Production (à mettre à jour après déploiement)
  production: {
    // Remplacez par votre URL Render réelle après déploiement
    api: 'https://kivi-chatbot.onrender.com/api'
  },
  
  // Netlify Functions (alternative)
  netlify: {
    api: '/.netlify/functions/chatbot'
  }
};

export function getApiUrl() {
  const hostname = window.location.hostname;
  
  // Environnement local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return API_CONFIG.development.api;
  }
  
  // Netlify (detected by domain)
  if (hostname.includes('netlify.app')) {
    return API_CONFIG.netlify.api;
  }
  
  // Production avec Render backend
  return API_CONFIG.production.api;
}
