# 🤖 Kivi ChatBot - Guide d'Installation et Configuration

## Overview

Kivi est un assistant IA intelligent pour KV Smart alimenté par **OpenAI API**. Il offre une compréhension naturelle du langage et des réponses contextuelles.

## Architecture

```
┌──────────────────────┐
│   Frontend (HTML)    │
│   kivi-chatbot.js    │
└──────────┬───────────┘
           │ (HTTP REST API)
┌──────────v───────────────┐
│  Backend (Node.js)       │
│  server.js + Express     │
└──────────┬───────────────┘
           │ (API Call)
┌──────────v───────────────┐
│   OpenAI API (ChatGPT)   │
└──────────────────────────┘
```

## Installation

### 1. Prérequis
- Node.js 16+ installé
- Une clé API OpenAI (https://platform.openai.com/api-keys)
- npm ou yarn

### 2. Installation des dépendances

```bash
cd "/Users/brunokroonen/Desktop/SITE WEB V2"
npm install
```

Cela installe les packages:
- `express` - Serveur web
- `cors` - Gestion CORS
- `dotenv` - Variables d'environnement
- `axios` - Appels HTTP

### 3. Configuration de l'environnement

Créez un fichier `.env` basé sur `.env.example`:

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé API OpenAI:

```env
OPENAI_API_KEY=sk-your-key-here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Démarrer le serveur

Mode développement (avec rechargement automatique):
```bash
npm run dev
```

Mode production:
```bash
npm start
```

Vous devriez voir:
```
🤖 Kivi ChatBot Server en cours d'exécution sur http://localhost:3001
📡 API OpenAI connectée ✓
```

## Configuration OpenAI

### Obtenir une clé API

1. Allez sur https://platform.openai.com/api-keys
2. Cliquez sur "Create new secret key"
3. Copiez la clé et placez-la dans `.env`
4. Activez la facturation sur votre compte OpenAI

### Modèle utilisé

Par défaut, nous utilisons **gpt-3.5-turbo** (plus rapide et moins cher).

Pour utiliser GPT-4 (plus puissant):
```javascript
// server.js - ligne 68
model: 'gpt-4', // au lieu de 'gpt-3.5-turbo'
```

## Déploiement

### Option 1: Vercel (Recommandé)

1. Installez Vercel CLI:
```bash
npm install -g vercel
```

2. Déployez:
```bash
vercel
```

3. Configurez les variables d'environnement dans Vercel Dashboard

### Option 2: Heroku

1. Créez une app Heroku
2. Déployez via Git
3. Ajoutez la variable d'environnement: `OPENAI_API_KEY`

### Option 3: OVH / VPN Personnel

Mettez à jour `FRONTEND_URL` dans `.env` avec votre domaine.

## Personnalisation

### Modifier le Système Prompt

Le fichier `server.js` contient `SYSTEM_PROMPT` qui définit le comportement de Kivi.

Modifiez-le pour adapter les réponses à vos besoins:

```javascript
const SYSTEM_PROMPT = `Tu es Kivi, assistant IA pour KV Smart...
// Vos modifications ici
`;
```

### Ajouter des capacités

Vous pouvez ajouter:
- Intégration CRM
- Support de tickets
- Feedback utilisateur
- Logging analytique

Exemple d'extension:

```javascript
app.post('/api/feedback', (req, res) => {
  const { conversationId, rating, feedback } = req.body;
  // Sauvegarder le feedback
  res.json({ success: true });
});
```

## Troubleshooting

### Erreur: "OPENAI_API_KEY not configured"

```bash
# Vérifiez que votre .env existe et contient la clé
cat .env | grep OPENAI_API_KEY

# Relancez le serveur après modification de .env
npm run dev
```

### Erreur: 429 (Rate Limiting)

Votre compte OpenAI a atteint la limite de requêtes. Attendez ou augmentez votre quota dans le dashboard OpenAI.

### Erreur: "Unable to connect to the server"

1. Vérifiez que le serveur est lancé (`npm run dev`)
2. Vérifiez l'URL de l'API dans `kivi-chatbot.js`
3. Vérifiez les autorisations CORS dans `server.js`

## API Reference

### `POST /api/message`

Envoie un message et reçoit une réponse de l'IA.

**Request:**
```json
{
  "message": "Quels services proposez-vous?",
  "conversationId": "conv_xyz..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "KV Smart propose plusieurs services...",
  "conversationId": "conv_xyz..."
}
```

### `POST /api/conversation/clear`

Réinitialise une conversation.

**Request:**
```json
{
  "conversationId": "conv_xyz..."
}
```

### `GET /api/health`

Vérifie le statut du serveur.

**Response:**
```json
{
  "status": "ok",
  "service": "Kivi ChatBot API",
  "apiConnected": true
}
```

## Performance

- **Temps de réponse moyen**: 2-3 secondes (gpt-3.5-turbo)
- **Coût par message**: ~$0.001 (gpt-3.5-turbo)
- **Limite requêtes**: 3,500 RPM (dépend de votre plan)

## Sécurité

- 🔒 La clé API OpenAI ne doit JAMAIS être exposée au frontend
- 📝 Validez tous les inputs utilisateur
- 🛡️ Utilisez CORS appropriamment
- ⏱️ Implémentez une limite de rate-limiting

## Améliorations futures

- [ ] Historique persistant (Base de données)
- [ ] Support de plusieurs langues avancé
- [ ] Traitement d'images
- [ ] Intégration vidéo réelle
- [ ] Dashboard admin
- [ ] Analytics utilisateur

## Support

Pour des questions:
1. Consultez la documentation OpenAI: https://platform.openai.com/docs
2. Vérifiez les logs du serveur en mode développement

---

**Version**: 1.0.0  
**Dernière mise à jour**: Avril 2026  
**Créé pour**: KV Smart SARL
