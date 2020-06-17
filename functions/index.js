const functions = require('firebase-functions');
const express = require('express');
const { getAllScreams, postOneScream } = require('./routes/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./routes/users');
const firebaseAuth = require('./utils/firebaseAuth');

const app = express();

app.get('/screams', getAllScreams);
app.post('/scream', firebaseAuth, postOneScream);

app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuth, uploadImage);
app.post('/user', firebaseAuth, addUserDetails);
app.get('/user', firebaseAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
