const express = require('express');
const app = express();
const port = 8383;
const { db } = require('./firebase.js');
const User = require('./models/userModel.js');

app.use(express.json());

//create user with POST request
app.post('/addUser', async (req, res) => {
    try {
        const { firstname, lastname, email, password, skintype, skinproblems } = req.body;

        //validate required fields
        if (!firstname || !lastname || !email || !password || !skintype){
            return res.status(400).send('Missing required fields');
        }

        //create new user instance
        const user = new User(firstname, lastname, email, password, skintype, skinproblems);

        //add doc to firestore
        const docRef = await db.collection('users').add({ ...user });

        res.status(200).send(`User created successfully with ID: ${docRef.id}`);
    } catch(error) {
        console.log('Error creating user:', error);
        res.status(500).send(`Error creating user: ${error.message}`);
    }
});

//update user with 


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
