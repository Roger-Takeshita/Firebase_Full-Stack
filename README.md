<h1 id='summary'>Summary</h1>

-   [Firebase](#firebase)
    -   [Create New Project](#createnewproject)
    -   [Initialize Project - Without Express](#firebaseinit)
    -   [Using Express With Firebase](#firebaseexpress)
        -   [User Authentication](#userauthentication)
        -   [Packages](#installfirebaselibray)
        -   [Config Auth](#configauth)
            -   [Environment Variables](#environment)
        -   [Sign Up Route](#signup)
        -   [Login Route](#login)
        -   [Middleware - Auth](#middleware)

<h1 id='firebase'>Firebase</h1>

<h2 id='createnewproject'>Create New Project</h2>

[Go Back to Summary](#summary)

-   Steps to create a new project

    ```Bash
      firebase init
        Functions: configure and deploy Cloud functions
        Use and existing project
          Select from the options
        ESLint -> No
        install all packages -> Yes

      Change dir to **functions** folder
    ```

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

<h2 id='firebaseexpress'>Using Express With Firebase</h2>

[Go Back to Summary](#summary)

-   in `functions/index.js`

    -   let's refactor our app to use express to help us handling different method (request) for the same endpoint
    -   First we need to install express
        -   In the **functions** folder run the command
            -   `npm i express`
    -   Then we need to create a new express app
        -   Import **express**, require from `express`
        -   then create a new express app
    -   After that, we just need to convert our endpoints (getScreams and createScreams)
        -   We can use `app.get()` for get requests
        -   and `app.post()` for post requests
    -   In the end we just need to export our single **api** endpoint and pass our **app**

        -   This will automatically crete multiple endpoints

        ```JavaScript
          const functions = require('firebase-functions');
          const admin = require('firebase-admin');
          const express = require('express');
          let serviceAccount = require('./serviceAccountKey.json');

          admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              databaseURL: 'https://socialape-4ee16.firebaseio.com',
          });
          const app = express();

          app.get('/screams', (req, res) => {
              admin
                  .firestore()
                  .collection('screams')
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

          exports.api = functions.https.onRequest(app);
        ```

<h3 id='userauthentication'>User Authentication</h3>

[Go Back to Summary](#summary)

-   Go to our project dashboard on [firebase console](https://console.firebase.google.com)

    -   Then click on `Authentication`
        -   Then enable it clicking on `Set up sign-in method`
            -   Choose **Email/Password**
                -   Click on `Enable` and then `Save`
    -   Then go to our project settings

        -   On **General** tab, click on **Add Firebase to your web app**
        -   Copy the `config` object

        ```JavaScript
            var config = {
                apiKey: 'AIzaSyBayN3wy36U3KAahishfaahi_yfnoE',
                authDomain: 'socialape-4ee16.firebaseapp.com',
                databaseURL: 'https://socialape-4ee16.firebaseio.com',
                projectId: 'socialape-4ee16',
                storageBucket: 'socialape-4ee16.appspot.com',
                messagingSenderId: '4805afasd19',
                appId: '1:4805afasd19:web:67741adf6c1cfasd1237335a',
                measurementId: 'G-2F1231SFB6R',
            };
        ```

<h3 id='installfirebaselibray'>Packages</h3>

[Go Back to Summary](#summary)

-   install firebase library

    -   We are going to use this library to sign in and sign up users and get authentication tokens

    ```Bash
      npm i firebase
    ```

<h3 id='configauth'>Config Auth</h3>

[Go Back to Summary](#summary)

<h4 id='environment'>Environment Variables</h4>

-   to set environment variables firebase gives us a couple of commands do to so

    -   with the `config` variables that we got from our console, we can transform them into environment variables using the following commands
        -   **Set Variables** - `firebase functions:config:set`
        -   **Get Variables** - `firebase functions:config:get`
        -   Pipe the env variables into a json file
            -   `firebase functions:config:get > env.json`
    -   Additional Environment Commands

        ```Bash
          firebase functions:config:unset key1 key2 removes the specified keys from the config
          firebase functions:config:clone --from <fromProject> clones another project's environment into the currently active project.
        ```

-   with the config variable that we got from our console

    ```JavaScript
      var config = {
          apiKey: 'AIzaSyBayN3wy36U3KAahishfaahi_yfnoE',
          authDomain: 'socialape-4ee16.firebaseapp.com',
          databaseURL: 'https://socialape-4ee16.firebaseio.com',
          projectId: 'socialape-4ee16',
          storageBucket: 'socialape-4ee16.appspot.com',
          messagingSenderId: '4805afasd19',
          appId: '1:4805afasd19:web:67741adf6c1cfasd1237335a',
          measurementId: 'G-2F1231SFB6R',
      };
    ```

-   we transform into the following command line

    ```Bash
      firebase functions:config:set config.api_key='AIzaSyBayN3wy36U3KAahishfaahi_yfnoE'
                                    config.auth_domain='socialape-4ee16.firebaseapp.com'
                                    config.database_url='https://socialape-4ee16.firebaseio.com'
                                    config.project_id='socialape-4ee16'
                                    config.storage_bucket='socialape-4ee16.appspot.com'
                                    config.messaging_sender_id='4805afasd19'
                                    config.app_id='1:4805afasd19:web:67741adf6c1cfasd1237335a'
                                    config.measurement_id='G-2F1231SFB6R'
    ```

-   then the create a new `env.json` (our local env file) so we can use with our local serve

    ```Bash
      firebase functions:config:get > env.json
    ```

-   in `functions/index.js`

    -   We check our firebase internal config, if there is any environment variable
        -   If yes, then we can use them
        -   If no, we use the internal config
    -   Require **firebase**
    -   Then initialize firebase app, and pass it the config object that we copied form firebase console

    ```JavaScript
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

      let env = require(./env.json);
      if (Object.keys(functions.config())****.length) {
          env = functions.config();
      }

      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: 'https://socialape-4ee16.firebaseio.com',
      });
      const app = express();
      firebase.initializeApp(config);

      app.get('/screams', (req, res) => {
          ...
      });

      app.post('/scream', (req, res) => {
          ...
      });

      exports.api = functions.https.onRequest(app);
    ```

<h3 id='signup'>Sign Up Route</h3>

[Go Back to Summary](#summary)

-   Create a new route to sing up new users

    -   then we use the **firebase** package to create a new user
        -   where the first argument is the email and the second argument is the password
        -   and this function returns a promise

    ```JavaScript
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
    ```

<h3 id='login'>Login Route</h3>

[Go Back to Summary](#summary)

```JavaScript
  app.post('/login', (req, res) => {
      const user = {
          email: req.body.email,
          password: req.body.password,
      };

      const errors = {};

      if (isEmpty(user.email)) errors.email = 'Must not be empty';
      if (isEmpty(user.password)) errors.password = 'Must not be empty';

      if (Object.keys(errors).length > 0) return res.status(400).json(errors);

      firebase
          .auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .then((data) => {
              return data.user.getIdToken();
          })
          .then((token) => {
              return res.json({ token });
          })
          .catch((error) => {
              console.error(error);

              if (error.code === 'auth/wrong-password') {
                  return res.status(403).json({ general: 'Wrong credentials, please try again' });
              }

              return res.status(500).json({ error: error.code });
          });
  });
```

<h3 id='middleware'>Middleware - Auth</h3>

[Go Back to Summary](#summary)

-   Adding a middleware to check if the user is authorized to processed

    ```JavaScript
      const firebaseAuth = (req, res, next) => {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
              token = req.headers.authorization.split('Bearer ')[1];
          } else {
              console.error('Not token found');
              return res.status(403).json({ error: 'Unauthorized!' });
          }

          admin
              .auth()
              .verifyIdToken(token)
              .then((decodedToken) => {
                  req.user = decodedToken;
                  return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
              })
              .then((data) => {
                  req.user.handle = data.docs[0].data().handle;
                  return next();
              })
              .catch((error) => {
                  console.error('Error while verifying token', error);
                  return res.status(403).json(error);
              });
      };

      ...

      app.post('/scream', firebaseAuth, (req, res) => {
          ...
      });
    ```
