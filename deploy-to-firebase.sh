#!/bin/bash

set -e

echo ""
echo "🚀 Firebase Setup Script for Codespaces or Headless Environments"
echo "---------------------------------------------------------------"

# Step 1: Ensure Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo "⬇️ Installing Firebase CLI..."
  npm install -g firebase-tools
else
  echo "✅ Firebase CLI is already installed."
fi

echo ""

# Step 2: Check for FIREBASE_TOKEN
if [ -z "$FIREBASE_TOKEN" ]; then
  echo "❌ No FIREBASE_TOKEN found in environment."
  echo ""
  echo "You need to generate a Firebase CI token to deploy from this environment."
  echo "1. Open this URL on your local machine:"
  echo ""
  firebase login:ci --no-localhost || {
    echo ""
    echo "⚠️ Couldn't complete token generation. Try running this on your local machine:"
    echo "    firebase login:ci --no-localhost"
    echo ""
    exit 1
  }
  echo ""
  echo "✅ Copy the token and go to:"
  echo "   GitHub → Your Repo → Settings → Codespaces → Secrets"
  echo "   Add a new secret named: FIREBASE_TOKEN"
  echo ""
  echo "Then reload the Codespace or restart the setup script."
  exit 0
fi

echo "✅ FIREBASE_TOKEN is available."
echo ""

# Step 3: Push secret(s) to Firebase
if [ -n "$GOOGLE_API_KEY" ]; then
  echo "🔐 Pushing GOOGLE_API_KEY to Firebase Functions secrets..."
  firebase functions:secrets:set GOOGLE_API_KEY <<< "$GOOGLE_API_KEY" --force --token "$FIREBASE_TOKEN"
else
  echo "⚠️ GOOGLE_API_KEY not set. You can add it as a Codespaces secret for automatic deployment."
fi

# Step 4: Deploy to Firebase
echo ""
echo "🚀 Deploying to Firebase..."
firebase deploy --only functions,hosting --token "$FIREBASE_TOKEN"

echo ""
echo "✅ Done."
