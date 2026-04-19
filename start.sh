#!/bin/bash
# Kivi ChatBot Setup & Run Script

echo "🤖 Kivi ChatBot - Installation & Démarrage"
echo "==========================================="
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "Téléchargez-le sur https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js trouvé: $(node --version)"
echo "✓ npm trouvé: $(npm --version)"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo ""
    
    if [ -f .env.example ]; then
        echo "Création de .env depuis .env.example..."
        cp .env.example .env
        echo "✓ .env créé"
        echo ""
        echo "⚠️  IMPORTANT: Éditez .env et ajoutez votre clé OpenAI!"
        echo "    OPENAI_API_KEY=sk-your-key-here"
        echo ""
    fi
fi

# Installer dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo "✓ Dépendances installées"
    echo ""
fi

# Démarrer le serveur
echo "🚀 Démarrage de Kivi ChatBot Server..."
echo ""
echo "Le serveur sera accessible à: http://localhost:3001"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo "==========================================="
echo ""

npm run dev
