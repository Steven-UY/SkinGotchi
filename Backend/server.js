const express = require('express');
const app = express();
const port = 8383;
const { db } = require('./firebase.js');
const User = require('./models/userModel.js');
const { getAuth } = require('firebase-admin/auth');

app.use(express.json());


//create user with POST request
app.post('/addUser', async (req, res) => {
    try {
        const { firstname, lastname, email, password, skintype, skinproblems } = req.body;

        //validate required fields
        if (!firstname || !lastname || !email || !password || !skintype){
            return res.status(400).send('Missing required fields');
        }

        //create user with firebase authentication
        const userRecord = await getAuth().createUser({
            email: email,
            password: password,
            displayName: `${firstname} ${lastname}`,
            disabled: false
        });

        console.log('Successfully created new user:', userRecord.uid);

        //create new user instance
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
    } catch(error) {
        console.log('Error creating user:', error);
        res.status(500).send(`Error creating user: ${error.message}`);
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
