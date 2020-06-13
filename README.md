firebase init
Functions: configure and deploy Cloud functions
Use and existing project
ESLint N
install all packages Yes

Change dir to **functions** folder

<h1 id='firebase'>Firebase</h1>

<h2 id='firebaseinit'>Initialize Project - Without Express</h2>

[Go Back to Summary](#summary)

-   in `functions/index.js`

    -   Require **functions** from `firebase-functions`
    -   Require **admin** from `firebase-admin`
        -   We use the **admin sdk** to access our database
        -   Initialize our app with `admin.initializeApp()`
            -   Usually we pass our project to `initializeApp()` but since we already have an `.firebaserc` file with:
                ```JavaScript
                  {
                    "projects": {
                      "default": "socialape-4ee16"
                    }
                  }
                ```
                -   We don't need to pass it anything
        -   Then we can create our first endpoint (`.getScreams`)
        -   and our second endpoint to `.createScream`

    ```JavaScript
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
    ```
