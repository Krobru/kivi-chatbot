# GUIDE DE DÉMARRAGE RAPIDE - Kivi IA

## 🚀 Étape 1: Configuration (5 minutes)

### 1.1 Obtenir une clé OpenAI

1. Allez sur https://platform.openai.com/api-keys
2. Connectez-vous (créez un compte si nécessaire)
3. Activez la facturation (https://platform.openai.com/account/billing/overview)
4. Générez une nouvelle clé API
5. Copiez-la

### 1.2 Configurer le projet

1. Ouvrez Terminal
2. Naviguez vers le dossier du site:
   ```bash
   cd "/Users/brunokroonen/Desktop/SITE WEB V2"
   ```

3. Créez le fichier `.env`:
   ```bash
   cp .env.example .env
   ```

4. Ouvrez `.env` avec votre éditeur et remplacez:
   ```env
   OPENAI_API_KEY=sk-votre-clé-ici
   ```

## 🎯 Étape 2: Installation (2 minutes)

```bash
# Installer les dépendances
npm install

# Ou utiliser le script de démarrage:
chmod +x start.sh
./start.sh
```

## 🔥 Étape 3: Lancer le serveur

```bash
npm run dev
```

Vous devriez voir:
```
🤖 Kivi ChatBot Server en cours d'exécution sur http://localhost:3001
📡 API OpenAI connectée ✓
```

## 🌐 Étape 4: Tester le chatbot

### Option 1: Depuis votre site local

1. Ouvrez votre site: `http://localhost:5500` ou votre serveur local
2. Cliquez sur le bouton 🤖 en bas à droite
3. Posez une question à Kivi!

### Option 2: Test direct de l'API

```bash
curl -X POST http://localhost:3001/api/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quels services proposez-vous?",
    "conversationId": "test-conv-123"
  }'
```

Réponse attendue:
```json
{
  "success": true,
  "message": "KV Smart propose plusieurs services..."
}
```

## 📝 Architecture

```
kivi-chatbot.js (Frontend)
         ↓ HTTP
    server.js (Backend Node.js/Express)
         ↓ API
  OpenAI API (GPT-3.5-turbo)
```

## 🛣️ Flux de communication

1. **Utilisateur** ➜ Pose une question dans le chat
2. **Frontend** ➜ Envoie via `POST /api/message` 
3. **Backend** ➜ Reçoit la question
4. **OpenAI** ➜ Traite et répond en IA
5. **Backend** ➜ Retourne la réponse
6. **Frontend** ➜ Affiche la réponse
7. **Utilisateur** ➜ Voit la réponse intelligente! 🎉

## 💬 Exemples de questions

Essayez ces questions pour voir Kivi en action:

### Services
- "Quels services proposez-vous?"
- "Avez-vous une solution de recharge électrique?"
- "Qu'est-ce que le Smart Building?"

### Contact
- "Comment puis-je vous contacter?"
- "Quel est votre numéro de téléphone?"
- "Où êtes-vous basés?"

### Projets
- "Je veux améliorer la sécurité de mon bâtiment"
- "J'ai un projet de digitalisation"
- "Pouvez-vous m'aider?"

## 🔧 Troubleshooting

### Problème: "Cannot find module 'express'"
```bash
npm install
```

### Problème: "OPENAI_API_KEY not configured"
- Vérifiez que `.env` existe
- Vérifiez que la clé est bien copiée
- Relancez le serveur

### Problème: "Port 3001 is already in use"
```bash
# Utilisez un autre port
PORT=3002 npm run dev
```

### Problème: "CORS error"
- Vérifiez que vous accédez depuis `http://localhost`
- Vérifiez les autorisations CORS dans `server.js`

## 📊 Coûts OpenAI

- GPT-3.5-turbo: ~$0.001 par message
- GPT-4: ~$0.03 par message
- Consultez https://openai.com/pricing pour les tarifs à jour

## 🚀 Prêt pour la production?

Avant de déployer en production:

1. ✅ Testez complètement
2. ✅ Configurez les variables d'environnement sur le serveur
3. ✅ Activez HTTPS
4. ✅ Limitez les requêtes (rate limiting)
5. ✅ Configurez les logs
6. ✅ Configurez les sauvegardes

## 📚 Ressources supplémentaires

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 Support

En cas de problème:
1. Vérifiez les logs du serveur (Terminal)
2. Consultez le README.md
3. Vérifiez votre clé API OpenAI

---

**Vous êtes prêt!** 🎉 Kivi est maintenant actif et intelligent! 🤖
