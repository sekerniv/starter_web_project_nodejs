# Starter Web Project - Firebase Cloud Functions

This repository contains starter code for a web application running on **Firebase Cloud Functions**. It serves static files from the `public` folder and exposes several simple endpoints, written in NodeJS. The main HTML page is views/index.ejs (using an EJS template).

## Getting Started
All dependencies should be automatically installed on the container. 
You'll need tosetup the following things:
1. Create Firebase account
2. Create Firebase project. 
3. Provide the app id as a secret (can we skip it if they don't want to use FireStore?)
4. Provide the Firbebase token (service-account-key.json -- see details below).
5. In order to run the server tap on the "humburger" menu and select "Run"-> select Run/Debug based on your needs.


If something is off and you want to manually run the installation and server, you can use these commands:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the function locally:
   ```bash
   npm start
   ```
   The app is served on `http://localhost:8080` by default.

## FirebStore Integration

1. Create a Firebase project and generate a **service account** key from the Firebase console.
2. Save the downloaded JSON file as `service-account-key.json` in the project root.
3. Running the function locally uses this key to connect to your production Firestore (there's no local firestore emulator).
4. Use the `/increment` endpoint to increase a shared counter stored in Firestore. Each call returns the updated value as plain text.

## Deployment

Pushing changes to the `main` branch triggers a GitHub Action that deploys the Cloud Function.
Before the first deploy, you'll have to run the ./setup-firebase-deploy.sh script and go through the token generation process.

## Development in Codespaces

A `.devcontainer` configuration automates installation of dependencies when the codespace is created. A Git `post-merge` hook also runs `npm install` after you pull new changes to keep dependencies up to date.

## Tech choices:
1. JS, css and HTML are all mandatory in Israel's curriculum for web dev. 
2. For JS I am opting for the "await" async style instead of callbacks. More modern and easier to follow (linear code)
3. For the backend NodeJS. I decided not to use the suggested Java EE nor Java Spring and ASP. They all felt too "boilerplatey" and outdated. Further more, there's no need to learn another coding language, as NodeJS is using JS (same as the client code). Express for NodeJS is easy to follow and requires minimal setup and boiler plate code.
4. Firebase functions - I wanted to make the deployment as easy as possible. Firebase is allowing deploying Firebase functions for free (with limits in quotas) and easy setup. It should be more than enough for the students backend needs.
5. FireStore - easy to ramp up to (much easier than SQL server). This goes against the ministry of education requirements, but feels better to me, given 1) the limited time we have for teaching (I'd doubt that the kids understand much from what we teach them on SQL) 2) the same tech will be used by those who will choose to also do a SWE Android project, which will help save time later.
5. EJS templating - simple, light templating engine. I wanted them to get familiar with HTML and understand the concept of server side, non static HTML. In the future, we could switch to more modern React style UI coding.
6. CSS - pure CSS without fancy CSS frameworks. I think that it makes sense for them to understand how CSS works before we're switching to more modern / easier CSS framework. Also, it felt like we have a good amount of frameworks already. I might revisit this decision later...
7. Deployment - using commit hooks. Once they do the initial setup with the deployment script, committing their code to the main branch will seamlessly deploy their code to a production server.
8. This project is using Github Templates and is meant to be given with GitHub classroom (assignment using the template). Submission of the final project by the students should be made by commit+push in git

## TODO:
* is there still a need to set github secrets? Can it work without it? do we also need project id in .firebaserc?
* what will happen if counter doesn't exist? Can we make it generate one?
* What happens if app secret is missing?
