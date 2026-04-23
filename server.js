// Kivi ChatBot Backend Server - Node.js/Express
// Connexion avec OpenAI API pour intelligence artificielle

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',
  'http://localhost:8000',
  'http://localhost:8080',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:8080',
  'https://kvs2.netlify.app',
  'https://kivi-chatbot.netlify.app',
  process.env.CORS_ORIGIN || 'https://kvs2.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser si pas d'origin (requêtes non-browser) ou si dans la liste
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(null, true); // Autoriser quand même pour debug
    }
  },
  credentials: true
}));
app.use(express.json());

// Stockage des conversations (en mémoire - utiliser une DB en production)
const conversations = new Map();

// Configuration OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Système prompt pour Kivi
const SYSTEM_PROMPT = `Tu es Kivi, un assistant IA intelligent pour KV Smart, une entreprise luxembourgeoise spécialisée dans les solutions Smart Building et de sécurité.

INFORMATIONS ENTREPRISE:
- Nom: KV Smart SARL
- Basée: Luxembourg (Capellen)
- Spécialités: Infrastructures électriques, Smart Building, Sécurité intelligente, Développements logiciels
- Services: Bornes de recharge VE, Gestion énergétique, Éclairage intelligent, Contrôle d'accès, Vidéosurveillance, Détection incendie, Supervision centralisée
- Contact: +352 691 028 028 | contact@kv-smart.lu
- Adresse: 77, route d'Arlon, L-8311 Capellen, Luxembourg

INSTRUCTIONS:
1. Sois amical, professionnel et utile
2. Réponds en français si demandé en français, en anglais si demandé en anglais
3. Si le client pose une question sur KV Smart, fournis des informations précises
4. Si le client a un projet, encourage-le à contacter directement l'équipe
5. Reste dans le contexte des services KV Smart
6. Si une question dépasse ton domaine, redirige vers le contact direct
7. Sois concis mais informatif (max 3-4 phrases par réponse)
8. Propose toujours une action suivante (demo, appel, email, etc.)

TONE: Professionnel mais accessible, innovant, orienté solutions.`;

// Endpoint pour envoyer un message
app.post('/api/message', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message vide' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Clé API OpenAI non configurée' });
    }

    // Créer ou récupérer la conversation
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }

    const conversationHistory = conversations.get(conversationId);

    // Ajouter le message utilisateur à l'historique
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Limiter l'historique à 10 messages précédents pour économiser les tokens
    const messages = conversationHistory.slice(-10);

    // Appel à OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.6,
        presence_penalty: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    // Ajouter la réponse de l'IA à l'historique
    conversationHistory.push({
      role: 'assistant',
      content: aiMessage
    });

    // Mettre à jour la conversation
    conversations.set(conversationId, conversationHistory);

    res.json({
      success: true,
      message: aiMessage,
      conversationId: conversationId
    });

  } catch (error) {
    console.error('Erreur API OpenAI:', error.response?.data || error.message);
    
    let errorMessage = 'Désolé, je rencontre une difficultés. Veuillez réessayer.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Erreur d\'authentification API.';
    } else if (error.response?.status === 429) {
      errorMessage = 'Trop de requêtes. Veuillez attendre un instant.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Erreur serveur OpenAI. Veuillez réessayer.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Endpoint pour vérifier la santé du serveur
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Kivi ChatBot API',
    apiConnected: !!OPENAI_API_KEY
  });
});

// Endpoint pour nettoyer une conversation
app.post('/api/conversation/clear', (req, res) => {
  const { conversationId } = req.body;
  if (conversationId && conversations.has(conversationId)) {
    conversations.delete(conversationId);
  }
  res.json({ success: true });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🤖 Kivi ChatBot Server en cours d'exécution sur http://localhost:${PORT}`);
  console.log(`📡 API OpenAI ${OPENAI_API_KEY ? 'connectée ✓' : 'NON connectée ✗'}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejected:', reason);
});
