const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./creds.json");
const cors = require('cors');
const verifyToken = require('./authMiddleware.js');
const cookieParser = require('cookie-parser');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));                                   
app.use(cookieParser());

const db = admin.firestore();

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

app.post('/storeToken', (req, res) => {
    const { token } = req.body;
    if (!token) {
        console.error('No token provided in request body');
        return res.status(400).json({ success: false, error: 'No token provided' });
    }
    console.log('Setting token in cookie:', token);
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.sendStatus(200);
});


app.get('/read/me', verifyToken, async (req, res) => {
    try {
      console.log('Fetching user data for UID:', req.uid);
      const userDoc = await db.collection('users').doc(req.uid).get();
      if (!userDoc.exists) {
        console.error('User not found for UID:', req.uid);
        res.status(404).json({ success: false, error: 'User not found' });
      } else {
        const userData = userDoc.data();
        console.log('User data:', userData);
        res.json({ success: true, data: userData });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

