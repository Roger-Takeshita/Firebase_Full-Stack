const functions = require('firebase-functions');
const express = require('express');
const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream,
} = require('./routes/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./routes/users');
const firebaseAuth = require('./utils/firebaseAuth');

const app = express();

app.get('/screams', getAllScreams);
app.post('/scream', firebaseAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', firebaseAuth, commentOnScream);
app.post('/scream/:screamId/like', firebaseAuth, likeScream);
app.post('/scream/:screamId/unlike', firebaseAuth, unlikeScream);
app.delete('/scream/:screamId/', firebaseAuth, deleteScream);

app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuth, uploadImage);
app.post('/user', firebaseAuth, addUserDetails);
app.get('/user', firebaseAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
