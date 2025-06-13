# Starter Web Project - Firebase Cloud Functions

This repository contains starter code for a web application running on **Firebase Cloud Functions**. It serves static files from the `public` folder and exposes a `/hello` endpoint that returns text.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the function locally:
   ```bash
   npm start
   ```
   The app is served on `http://localhost:8080` by default.

## Firebase Counter Integration

1. Create a Firebase project and generate a **service account** key from the Firebase console.
2. Save the downloaded JSON file as `service-account-key.json` in the project root.
3. Running the function locally uses this key to connect to your production Firestore.
4. Use the `/increment` endpoint to increase a shared counter stored in Firestore. Each call returns the updated value as plain text.

## Deployment

Pushing changes to the `main` branch triggers a GitHub Action that deploys the Cloud Function.

## Development in Codespaces

A `.devcontainer` configuration automates installation of dependencies when the codespace is created. A Git `post-merge` hook also runs `npm install` after you pull new changes to keep dependencies up to date.
