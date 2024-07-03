const express = require('express');
const path = require('path');
const { db, auth } = require('./firebase');
const User = require('./models/userModel');

const app = express();
const port = 8383;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/login.html'));
  });

// Create user with POST request
app.post('/addUser', async (req, res) => {
    try {

        const { firstname, lastname, email, password, skintype, skinproblems } = req.body;

        // Validate required fields
        if (!firstname || !lastname || !email || !password || !skintype) {
            return res.status(400).send('Missing required fields');
        }

        // Create user with Firebase authentication
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: `${firstname} ${lastname}`,
            disabled: false
        });

        console.log('Successfully created new user:', userRecord.uid);

        // Create new user instance
        const user = new User(firstname, lastname, email, password, skintype, skinproblems);

        // Add doc to Firestore (no password for security)
        const docRef = await db.collection('users').add({
            firstname: firstname,
            lastname: lastname,
            email: email,
            skintype: skintype,
            skinproblems: skinproblems
        });

        res.status(200).send(`User created successfully with ID: ${docRef.id}`);
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).send(`Error creating user: ${error.message}`);
    }
});

app.post('/verifyToken', async (req, res) => {
    //extracts the idtoken
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        // Verify the ID token obtain UID
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Fetch user data from Firestore using the UID
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        const userData = userDoc.data();

        // Send the user data as the response
        res.json(userData);
    } catch (error) {
        console.error('Error verifying ID token or fetching user data:', error);
        res.status(401).send('Unauthorized');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./creds.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());

app.use(express.urlencoded({extended: true}));

const db = admin.firestore();

//create user(with auth)
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

//creates user
app.post('/create', async(req, res) => {
    try{
        const id = req.body.email;
        console.log(req.body);
        const userJson = {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName 
        };
        const response = await db.collection("users").add(userJson);
        res.send(response);
    } catch(error) {
        res.send(error);
    }
})

//reads all the documents
app.get('/read/all', async(req, res) => {
    try{
        const usersRef = db.collection("users");
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch(error) {
        res.send(error);
    }
})

//read particular id
app.get('/read/:id', async (req, res) => {
    try{
        const usersRef = db.collection("users").doc(req.params.id);
        const response = await usersRef.get();
        res.send(responseArr);
    } catch(error) {
        res.send(error);
    }
})

//creates user with auth credentials
app.post('/signup', async(req, res) => {
    console.log(req.body);
    const user = {
        email : req.body.email,
        password : req.body.password
    }
    const userResponse = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false
    });
    res.json(userResponse);
})

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

/*
1) whenever we create a user it's with auth(done)
2) change the fields to match the data that we want
3) implement signin functionality with JWTs
*/