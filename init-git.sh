#!/bin/bash
# Script d'initialisation Git pour Kivi Chatbot

echo "🚀 Initialisation Git pour Kivi ChatBot"
echo "========================================"
echo ""

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé"
    echo "Téléchargez-le sur https://git-scm.com/"
    exit 1
fi

echo "✓ Git trouvé: $(git --version)"
echo ""

# Initialiser le repo si nécessaire
if [ ! -d .git ]; then
    echo "📦 Initialisation du repository Git..."
    git init
    echo "✓ Repository créé"
else
    echo "✓ Repository Git existe déjà"
fi

echo ""

# Vérifier si origin est configuré
if ! git remote get-url origin &>/dev/null; then
    echo "⚠️  Pas de remote GitHub configuré"
    echo ""
    echo "1. Créez un repo vide sur https://github.com/new"
    echo "   Nom: kivi-chatbot"
    echo ""
    echo "2. Puis exécutez:"
    echo "   git remote add origin https://github.com/VOTRE_USERNAME/kivi-chatbot.git"
    echo ""
else
    echo "✓ Remote GitHub: $(git remote get-url origin)"
fi

echo ""
echo "📝 Ajout des fichiers..."
git add .

echo "✓ Fichiers ajoutés"
echo ""

# Vérifier s'il y a des changements à committer
if git diff --cached --quiet; then
    echo "ℹ️  Aucun changement à committer"
else
    echo "📝 Création du commit..."
    git commit -m "Initial commit: Kivi AI Chatbot deployment"
    echo "✓ Commit créé"
    echo ""
    echo "🚀 Prêt pour pousser sur GitHub!"
    echo ""
    echo "Exécutez:"
    echo "  git branch -M main"
    echo "  git push -u origin main"
fi

echo ""
echo "========================================"
echo "✓ Initialisation terminée!"
