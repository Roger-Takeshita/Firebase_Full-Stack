const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const serviceAccount = require('./serviceAccountKey.json');
const firebase = require('firebase');

let env = require('./env.json');
if (Object.keys(functions.config()).length) {
    env = functions.config();
}

const config = {
    apiKey: env.config.api_key,
    authDomain: env.config.auth_domain,
    databaseURL: env.config.database_url,
    projectId: env.config.project_id,
    storageBucket: env.config.storage_bucket,
    messagingSenderId: env.config.messaging_sender_id,
    appId: env.config.app_id,
    measurementId: env.config.measurement_id,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://socialape-4ee16.firebaseio.com',
});

const app = express();
firebase.initializeApp(config);
const db = admin.firestore();

app.get('/screams', (req, res) => {
    db.collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let screams = [];
            data.docs.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                });
            });
            return res.json(screams);
        })
        .catch((error) => {
            console.error(error);
        });
});

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString(),
    };

    db.collection('screams')
        .add(newScream)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    let token, userId;

    // TODO validate user

    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'This handle is already taken' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId,
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                return res.status(400).json({ error: 'Email is already in use' });
            }
            return res.status(500).json({ error: error.code });
        });
});

exports.api = functions.https.onRequest(app);
