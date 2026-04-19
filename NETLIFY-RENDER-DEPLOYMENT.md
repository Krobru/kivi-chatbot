# 🚀 Guide de Déploiement Netlify + Render

## Architecture de Déploiement

```
┌─────────────────┐
│  Frontend       │
│ (HTML/JS/CSS)   │
│  ↓ Netlify      │
│ your-site.netlify.app
└────────┬────────┘
         │ API calls
         ↓
┌─────────────────┐
│  Backend (IA)   │
│  (Node.js)      │
│  ↓ Render       │
│ your-app.onrender.com
└──────────┬──────┘
           │
           ↓
    ┌─────────────┐
    │ OpenAI API  │
    └─────────────┘
```

---

## Partie 1: Préparer le Code

### 1.1 Initialiser Git

```bash
cd "/Users/brunokroonen/Desktop/SITE WEB V2"

# Initialiser le repo
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Kivi AI Chatbot"
```

### 1.2 Créer un repo GitHub

1. Allez sur https://github.com/new
2. Créez un nouveau repo appelé `kivi-chatbot`
3. **Ne créez PAS** de README (déjà dans votre code)
4. Cliquez "Create repository"

### 1.3 Pousser le code sur GitHub

```bash
# Remplacez USERNAME par votre username GitHub
git remote add origin https://github.com/USERNAME/kivi-chatbot.git
git branch -M main
git push -u origin main
```

Vous devriez voir votre code sur https://github.com/USERNAME/kivi-chatbot ✅

---

## Partie 2: Déployer le Backend sur Render

### 2.1 Créer un compte Render

Allez sur https://render.com et créez un compte gratuit.

### 2.2 Créer un nouveau Web Service

1. Cliquez sur `+` → "New Web Service"
2. Sélectionnez "GitHub"
3. Autorisez l'accès à vos repos
4. Sélectionnez `kivi-chatbot`

### 2.3 Configurer le Web Service

**Build Settings:**
- Build command: `npm install`
- Start command: `npm start`
- Environment: Node 18+

**Environment Variables:**
Cliquez "Add Environment Variable" et ajoutez:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-proj-VOTRE_CLÉ_ICI` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

### 2.4 Déployer

Cliquez sur "Create Web Service" ✅

**Attendez 2-3 minutes** que le serveur se lance. Vous verrez:
```
Active - Service is live
```

**Notez votre URL Render:**
```
https://kivi-chatbot.onrender.com
```

### 2.5 Tester le backend

Ouvrez dans votre navigateur:
```
https://kivi-chatbot.onrender.com/api/health
```

Vous devriez voir:
```json
{
  "status": "ok",
  "service": "Kivi ChatBot API",
  "apiConnected": true
}
```

✅ Backend prêt!

---

## Partie 3: Déployer le Frontend sur Netlify

### 3.1 Créer un compte Netlify

Allez sur https://netlify.com et créez un compte gratuit.

### 3.2 Connecter GitHub

1. Cliquez "Add new site"
2. Sélectionnez "Import an existing project"
3. Choisissez "GitHub"
4. Autorisez l'accès
5. Sélectionnez `USERNAME/kivi-chatbot`

### 3.3 Configurer le build

**Settings:**
- Build command: `npm install` (ou laisser vide)
- Publish directory: `.` (racine)
- Laissez les autres par défaut

### 3.4 Déployer

Cliquez "Deploy" ✅

**Attendez 1-2 minutes.** Vous verrez:
```
Site deploy complete
```

Votre URL Netlify:
```
https://kivi-chatbot.netlify.app
```

---

## Partie 4: Mettre à Jour l'API

Maintenant il faut connecter le frontend au backend Render.

### Dans le fichier `kivi-chatbot.js`

Modifiez la méthode `getApiUrl()` pour utiliser votre URL Render:

```javascript
getApiUrl() {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  // Remplacez par votre URL Render
  return 'https://kivi-chatbot.onrender.com/api';
}
```

### Pousser les changements

```bash
git add kivi-chatbot.js
git commit -m "Update API URL for production"
git push origin main
```

Netlify va **redéployer automatiquement** 🚀

---

## ✅ Vérifier le Déploiement

### Test final:

1. Ouvrez votre site: https://kivi-chatbot.netlify.app
2. Cliquez sur le 🤖
3. Posez une question: "Qui es-tu?"
4. **Kivi devrait répondre intelligemment!** ✨

---

## 🔗 Vos URLs finales

```
Frontend:  https://kivi-chatbot.netlify.app
Backend:   https://kivi-chatbot.onrender.com
API:       https://kivi-chatbot.onrender.com/api
```

---

## 📝 Commandes Git utiles

**Voir le statut:**
```bash
git status
```

**Voir l'historique:**
```bash
git log
```

**Modifier le dernier commit:**
```bash
git add .
git commit --amend --no-edit
git push origin main -f
```

---

## 🆘 Troubleshooting

### Render dit "Build failed"
→ Vérifiez que `package.json` existe et est valide  
→ Vérifiez les logs Render pour plus de détails

### Netlify dit "Deploy failed"
→ Vérifiez le fichier `package.json`  
→ Consultez les logs Netlify

### Le chatbot ne répond pas
→ Vérifiez que l'URL Render dans `getApiUrl()` est correcte  
→ Vérifiez que `OPENAI_API_KEY` est configurée sur Render  
→ Consultez la console (F12 → Console) pour les erreurs

### "API connexion refused"
→ Attendez 5 minutes (Render peut être lent au démarrage)  
→ Redéployez le service Render

---

## 🎉 Vous êtes en production!

Votre Kivi AI est maintenant **accessible au monde entier** 🌍

Partagez votre lien: `https://kivi-chatbot.netlify.app` 🚀

---

**Questions?** Les erreurs spécifiques vont apparaître dans:
- **Frontend errors**: Console du navigateur (F12)
- **Backend errors**: Logs Render (dans votre dashboard)
- **API errors**: Réponse JSON de l'API

Consultez ces logs pour debugger!
