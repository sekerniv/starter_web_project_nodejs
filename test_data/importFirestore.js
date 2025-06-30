const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(require('../service-account-key.json'))
});

const db = admin.firestore();
const data = JSON.parse(fs.readFileSync('test_data/books.json'));

async function importCollection(collectionName) {
  const batch = db.batch();

  data.forEach(item => {
    const { id, ...fields } = item;
    const ref = db.collection(collectionName).doc(id);
    batch.set(ref, fields);
  });

  await batch.commit();
  console.log(`Imported ${data.length} documents into ${collectionName}`);
}

importCollection('Books');
