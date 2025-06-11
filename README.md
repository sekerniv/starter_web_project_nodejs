# Starter Web Project - Firebase

This repository contains starter code for a small web application now configured to run on **Firebase Hosting** with **Cloud Functions**. The UI lives in the `public` folder and dynamic routes are served from the function defined in `functions/index.js`.

## Getting Started

1. Install dependencies for both the root project and the Cloud Function:
   ```bash
   npm install
   (cd functions && npm install)
   ```
2. Start the local emulators:
   ```bash
   npm run serve
   ```
3. The helper script `npm run start-server` performs the same task and restarts the emulators if they were already running.
4. Open your browser to `http://localhost:5000` and you should see **Hello world!** displayed.

## Firebase Counter Integration

1. Create a Firebase project and generate a **service account** key from the Firebase console.
2. Save the downloaded JSON file as `firebaseKey.json` in the project root.
3. When running locally or after deploying, the `/increment` endpoint will increase a shared counter stored in Firestore. Each call returns the updated value as plain text.

## Development in Codespaces

A `.devcontainer` configuration automates installation of dependencies when the codespace is created. A Git `post-merge` hook also runs `npm install` after you pull new changes to keep dependencies up to date.
