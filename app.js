const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { getDrivingDistances } = require('./services/googleMaps');
const { calculateParkingFee } = require('./services/pricing');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');



const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Adding support for layouts
app.use(expressLayouts);
app.set('layout', 'layout');

app.set('trust proxy', 1);
app.use(cookieParser('your-secret-key'));

app.use((req, res, next) => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  const user = req.signedCookies.user;
  console.log("Signed cookies:", req.signedCookies);
  console.log('Headers:', req.headers);
  if (user) {
    req.user = user;
    res.set('Cache-Control', 'private');
  }
  next();
});



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

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    activeTab: '',
    user: req.user
  });
});

app.use(express.urlencoded({ extended: true }));

// Handle login form submission
app.post('/login', (req, res) => {
  console.log("Set-Cookie header:", res.getHeader('Set-Cookie'));
  const { username, password } = req.body;

  // Replace with real credential check
  if (username === 'admin' && password === '1234') {
     res.set('Cache-Control', 'private');
    // TODO: remove the secure if it's not required
  res.cookie('__session', username, {
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
    res.redirect('/');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Handle logout
app.get('/logout', (req, res) => {
  res.clearCookie('__session');
  res.redirect('/');
});

app.get('/', async (req, res) => {
  console.log('Cookies:', req.cookies);
  console.log('Signed cookies:', req.signedCookies);
  
  let counter = 0;
  try {
    const doc = await db.collection('counters').doc('clicks').get();
    if (doc.exists) {
      counter = doc.data().value;
    }
  } catch (err) {
    console.error('Error reading counter', err);
  }
  res.render('index', {
    counter: counter,
    title: 'Find Parking',
    activeTab: 'home',
    user: req.user || null,
  });
});

app.get('/about', async (req, res) => {
  res.render('about', {
    title: 'about',
    activeTab: 'about',
    user: req.user || null,
  });
});

app.get('/settings', requireLogin, (req, res) => {
  res.render('settings', {
    title: 'Settings',
    activeTab: 'settings',
    user: req.user,
  });
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
    const googleApiKey = process.env.GOOGLE_API_KEY;
    console.log("GOOGLE_API_KEY (length):", process.env.GOOGLE_API_KEY?.length);
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

function requireLogin(req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const googleApiKey = defineSecret("GOOGLE_API_KEY");

exports.app = onRequest(
  {
    secrets: [googleApiKey]
  },
  app
);
