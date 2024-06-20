const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

//Initializing on cloud functions
initializeApp();
const db = getFirestore();

//add data to collection 'users'
const res = await.db.collection('users').add({
    firstname: 'George',
    lastname: 'Hotz',
    skintype: 'Oily'
});
console.log('Added document with ID: ',res.id);