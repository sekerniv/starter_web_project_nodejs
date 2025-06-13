#!/bin/bash

set -e

echo "🚀 Firebase Token Generator (Headless / GitHub Codespaces Friendly)"

# Step 1: Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo "⬇️ Installing Firebase CLI..."
  npm install -g firebase-tools
else
  echo "✅ Firebase CLI is already installed."
fi

# Step 2: Show instructions
echo ""
echo "📢 This script will generate a CI token for Firebase."
echo "🧠 You will need to open a URL on your local machine to authorize."
echo "➡️ Starting login..."

firebase logout
firebase login:ci --no-localhost
