const functions = require('firebase-functions');
const express = require('express');
const { getAllScreams, postOneScream } = require('./routes/screams');
const { signup, login } = require('./routes/users');
const firebaseAuth = require('./utils/firebaseAuth');

const app = express();

app.get('/screams', getAllScreams);
app.post('/scream', firebaseAuth, postOneScream);

app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);
