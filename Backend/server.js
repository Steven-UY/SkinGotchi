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
