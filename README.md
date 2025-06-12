# Starter Web Project - Firebase

This repository contains starter code for a small web application now configured to run on **Firebase Hosting** with **Cloud Functions**. The UI lives in the `public` folder and dynamic routes are served from the function defined in `functions/index.js`.

## Getting Started

1. Install dependencies for both the root project and the Cloud Function:
   ```bash
   npm install
   (cd functions && npm install)
   ```
2. Start the development server which connects directly to your production Firestore data:
   ```bash
   npm start
   ```
   The helper script `npm run start-server` performs the same task and restarts the server if it was already running.
3. Open your browser to `http://localhost:3000` and you should see **Hello world!** displayed.
4. In Codespaces the port is automatically forwarded so the **Open Website** button opens the app at `http://localhost:3000`.
5. Development uses your live Firestore data. Any changes made locally will immediately affect production.

## Firebase Counter Integration

1. Create a Firebase project and generate a **service account** key from the Firebase console.
2. Save the downloaded JSON file as `firebaseKey.json` in the project root.
3. When running locally or after deploying, the `/increment` endpoint will increase a shared counter stored in Firestore. Each call returns the updated value as plain text.

## Development in Codespaces

A `.devcontainer` configuration installs dependencies for both the root project and the Cloud Functions when the codespace is created or started. A Git `post-merge` hook also runs `npm install` in the root and `functions` directories after you pull new changes to keep everything up to date.

## Using Production Firestore

The application does **not** rely on the Firebase emulators. Both local
development in Codespaces and deployed environments connect directly to your
Firebase project's Firestore instance. Be cautious when testing features as they
will modify production data.

## Deploying to Firebase

1. Log in to Firebase and select your project:
   ```bash
   npx firebase login
   npx firebase use --add
   ```
   This writes your project id to `.firebaserc`.
2. Deploy all configured services (functions, hosting, storage, etc.) with:
   ```bash
   npm run deploy
   ```

