const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

const keyPath = path.join(__dirname, 'firebaseKey.json');
if (fs.existsSync(keyPath)) {
  const serviceAccount = require(keyPath);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  app.locals.db = admin.firestore();
}

app.use(express.static(path.join(__dirname, 'public')));




// ##### YOUR CODE STARTS HERE: ######
app.get('/hello', (req, res) => {
  const name = req.query.name;
  res.send(`Hello, ${name}`);
});

app.post('/increment', async (req, res) => {
  const db = req.app.locals.db;

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
