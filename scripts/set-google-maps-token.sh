#!/usr/bin/env bash

# Exit on any error
set -e

# Check if firebase-tools is installed; install if not
if ! command -v firebase &> /dev/null; then
  echo "🔧 Installing Firebase CLI..."
  npm install -g firebase-tools
fi

echo ""
echo "📌 Please enter your Google Maps API key and press ENTER:"
read -r API_KEY

# Login to Firebase in headless mode
echo ""
echo "🌐 Opening Firebase login in headless mode..."
firebase login:ci --no-localhost

# Set Firebase Functions config
echo ""
echo "🔐 Setting google.api_key in Firebase Functions config..."
firebase functions:config:set google.api_key="$API_KEY"

echo ""
echo "✅ Setup complete!"
