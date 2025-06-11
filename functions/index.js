const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

const app = express();

const keyPath = path.join(__dirname, '..', 'firebaseKey.json');
if (fs.existsSync(keyPath)) {
  const serviceAccount = require(keyPath);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  admin.initializeApp();
}

app.locals.db = admin.firestore();

// ##### YOUR CODE STARTS HERE: ######
app.get('/hello', (req, res) => {
  const name = req.query.name;
  res.send(`Hello, ${name}`);
});

app.post('/increment', async (req, res) => {
  const db = req.app.locals.db;
  if (!db) {
    res.status(500).send('Firestore not configured');
    return;
  }
  const counterRef = db.collection('counters').doc('clicks');
  const doc = await counterRef.get();

  let current = 0;
  if (doc.exists) {
    current = doc.data().value;
  }
  const updated = current + 1;
  await counterRef.set({ value: updated });
  res.send(updated.toString());
});

exports.app = functions.https.onRequest(app);
