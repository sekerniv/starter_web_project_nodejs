const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { getDrivingDistances } = require('./services/googleMaps');
const { calculateParkingFee } = require('./services/pricing');


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

app.use(express.static(path.join(__dirname, 'public')));

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

const HOURS_TO_CALCULATE = [12, 24, 48];

app.post('/nearbyParkingLots', async (req, res) => {
  try {
    const googleApiKey = functions.config().google.api_key;
    const { latitude, longitude, isResident = false } = req.body;

    const snapshot = await db.collection('parkingLots').get();
    const lots = [];
    snapshot.forEach(doc => {
      lots.push({ id: doc.id, ...doc.data() });
    });

    const distanceData = await getDrivingDistances({ latitude, longitude }, lots, googleApiKey);

    const now = new Date();
    const results = distanceData.map((lotWithDistance) => {
      const prices = HOURS_TO_CALCULATE.map(hours => {
        const exit = new Date(now.getTime() + hours * 60 * 60 * 1000);
        return calculateParkingFee(lotWithDistance, now, exit, isResident);
      });

      return {
        id: lotWithDistance.id,
        name: lotWithDistance.name,
        location: lotWithDistance.location,
        prices,
        distance: lotWithDistance.distance // for sorting
      };
    });

    results.sort((a, b) => a.distance - b.distance);
    res.json(results.map(({ distance, ...rest }) => ({
      ...rest,
      distanceText: `${(distance / 1000).toFixed(1)} km`
    })));
  } catch (error) {
    console.error('Error fetching distances:', error);
    res.status(500).send('Something went wrong');
  }
});

exports.app = functions.https.onRequest(app);
