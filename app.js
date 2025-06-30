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
  });
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
  });
});

app.post('/thankyou', (req, res) => {
  res.render('thankyou', {
    title: 'תודה',
  });
});

exports.app = functions.https.onRequest(app);
