const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.getScreams = functions.https.onRequest((req, res) => {
    admin
        .firestore()
        .collection('screams')
        .get()
        .then((data) => {
            let screams = [];
            data.docs.forEach((doc) => {
                screams.push(doc.data());
            });
            return res.json(screams);
        })
        .catch((error) => {
            console.error(error);
        });
});

exports.createScream = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ error: 'Method not allowed' });
    }

    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };

    admin
        .firestore()
        .collection('screams')
        .add(newScream)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        });
});
