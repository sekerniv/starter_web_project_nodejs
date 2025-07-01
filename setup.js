// setup.js
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = function setupApp(app) {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(expressLayouts);
  app.set('layout', 'layout');

  app.set('trust proxy', 1);
  //TODO: maybe move to app.js
  app.use(cookieParser('your-secret-key'));

  app.use((req, res, next) => {
  const user = req.signedCookies.__session;
    
    if (user) {
      req.user = user;
      res.set('Cache-Control', 'private');
    }
    next();
  });



  // Firebase setup
  const keyPath = path.join(__dirname, 'service-account-key.json');
  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    admin.initializeApp();
  }

  const db = admin.firestore();
  app.locals.db = db;

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));

  return db;
};
