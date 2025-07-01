const functions = require('firebase-functions');
const express = require('express');
const setupApp = require('./setup');

const app = express();
const db = setupApp(app);

app.get('/', async (req, res) => {
  const snapshot = await db.collection('Books').get();
  const books = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    data.id = doc.id;
    books.push(data);
  }

  res.render('index', {
    title: 'ספרים',
    books: books,
    user: req.user
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    activeTab: '',
    user: req.user
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const usersRef = db.collection('Users');
  const querySnapshot = await usersRef
    .where('username', '==', username)
    .where('password', '==', password)
    .get();

  if (querySnapshot.empty) {
    return res.status(401).send('Invalid credentials');
  }

  res.set('Cache-Control', 'private');
  res.cookie('__session', username, {
    signed: true,
    httpOnly: true,
    secure: true,
  });
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.clearCookie('__session');
  res.redirect('/');
});


app.get('/about', async (req, res) => {
  res.render('about', {
    title: 'about',
    user: req.user,
  });
});

app.get('/purchase/:id', async (req, res) => {
  const id = req.params.id;

  const doc = await db.collection('Books').doc(id).get();
  const book = doc.data();
  book.id = doc.id;

  res.render('purchase', {
    title: `רכישת הספר - ${book.title}`,
    book: book,
    user: req.user
  });
});

app.post('/thankyou', (req, res) => {
  res.render('thankyou', {
    title: 'תודה',
    user: req.user,
  });
});

app.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Signup',
    user: req.user
  });
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;


  const usersRef = db.collection('Users');
  const existing = await usersRef.where('username', '==', username).get();

  if (!existing.empty) {
    return res.status(400).send('Username already exists.');
  }

  await usersRef.add({ username, password });

  res.cookie('__session', username, {
    signed: true,
    httpOnly: true,
    secure: true,
  });

  res.redirect('/');
});
exports.app = functions.https.onRequest(app);
