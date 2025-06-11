# Starter Web Project - Node.js

This repository contains basic starter code for a Node.js web application.
It serves static files from the `public` folder and exposes a `/hello`
endpoint that returns the text `world`.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Start or restart the server using the helper script:
   ```bash
   npm run start-server
   ```
4. Open your browser to `http://localhost:3000` and you should see
   **Hello world!** displayed.

## Firebase Counter Integration

1. Create a Firebase project and generate a **service account** key from the
   Firebase console.
2. Save the downloaded JSON file as `firebaseKey.json` in the project root.
3. Start the server as normal. If the key is found, Firestore will be
   initialized automatically.
4. Use the `/increment` endpoint to increase a shared counter stored in
   Firestore. Each call returns the updated value as plain text.
