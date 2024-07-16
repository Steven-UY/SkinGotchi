const express = require("express");
const session = require('express-session'); 
const app = express();
const admin = require("firebase-admin");
const credentials = require("./creds.json");
const cors = require('cors');
const verifyToken = require('./authMiddleware.js');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const db = admin.firestore();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//create user with auth
app.post('/signup', async(req, res) => {
    try{
        const { email, password, firstName, lastName } = req.body;

        const userResponse = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: false,
            disabled: false
        });

        const userJson = {
            email: email,
            firstName: firstName,
            lastName: lastName,
        };
        await db.collection("users").doc(userResponse.uid).set(userJson);

        res.json(userResponse);
    } catch(error){
        res.status(400).send(error);
    }
});

//store token in session
app.post('/storeToken', (req, res) => {
    const { token } = req.body;
    req.session.token = token;
    res.sendStatus(200);
}) 

//read data for the logged-in user
app.get('/read/me', verifyToken, async (req, res) => {
    try {
      const userDoc = await db.collection('users').doc(req.uid).get();
      if (!userDoc.exists) {
        res.status(404).json({ success: false, error: 'User not found' });
      } else {
        res.json({ success: true, data: userDoc.data() });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

//update user
app.post('/update', async(req, res) => {
    try{
        const id = req.body.id;
        const newFirstName = "jeff";
        const userRef = await db.collection("users").doc(id)
        .update({
            firstName: newFirstName
        });
        res.send(response);
    } catch(error) {
        res.send(error);
    }
})

//delete document based on id
app.delete('/delete/:id', async(req, res) => {
    try{
        const response = await db.collection("users").doc(req.params.id).delete();
        res.send(response);
    } catch(error) {
        res.send(error);
    }
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);
});

