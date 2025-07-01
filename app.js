const functions = require('firebase-functions');
const express = require('express');
const setupApp = require('./setup');

const app = express();
const db = setupApp(app);

app.get('/', async (req, res) => {
  const snapshot = await db.collection('Books').get();
  const books = snapshot.docs.map(doc => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });

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
      secure: true,
    });
    res.redirect('/');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('__session');
  res.redirect('/');
});


app.get('/about', async (req, res) => {
  res.render('about', {
    title: 'about',
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

exports.app = functions.https.onRequest(app);
