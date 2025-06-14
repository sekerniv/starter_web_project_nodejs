const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const keyPath = path.join(__dirname, 'service-account-key.json');
if (fs.existsSync(keyPath)) {
  const serviceAccount = require(keyPath);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  admin.initializeApp();
}

const db = admin.firestore();
app.locals.db = db;

app.get('/', async (req, res) => {
  let counter = 0;
  try {
    const doc = await db.collection('counters').doc('clicks').get();
    if (doc.exists) {
      counter = doc.data().value;
    }
  } catch (err) {
    console.error('Error reading counter', err);
  }
  res.render('index', { counter });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/hello', (req, res) => {
  const name = req.query.name;
  res.send(`Hello, ${name}`);
});

app.post('/increment', async (req, res) => {
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

app.post('/nearbyParkingLots', async (req, res) => {
  const googleApiKey = functions.config().google.api_key;
  const { latitude, longitude } = req.body;
  const snapshot = await db.collection('parkingLots').get();
  const lots = [];
  snapshot.forEach(doc => {
    lots.push({
      id: doc.id,
      ...doc.data()
    });
  });
  const destinations = lots
  .map(loc => `${loc.location.latitude},${loc.location.longitude}`)
  .join('|');

const origin = `${latitude},${longitude}`;

const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${googleApiKey}&mode=driving`;

  const result = await fetch(url);
  const json = await result.json();

  const distances = json.rows[0].elements.map((el, i) => ({
    ...lots[i],
    distance: el.distance.value,
    distanceText: el.distance.text
  }));

  distances.sort((a, b) => a.distance - b.distance);
  res.json(distances);
});


exports.app = functions.https.onRequest(app);
