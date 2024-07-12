const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./creds.json");
const cors = require('cors');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const db = admin.firestore();

//route to verify token
app.post('/verify-token', async (req, res) => {
    const token = req.body.token;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        //token is valid use the uid to identify the user
        res.json({ success: true, uid: uid });
    } catch(error) {
        console.error('Error verifying token: ', error);
        res.status(401).json({ success: false, error: 'Invalid token'});
    }
});

//create user (with auth)
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
TODO:
1) whenever we create a user it's with auth[x]
2) implement signin functionality with JWTS[]
3) change the fields in the documents to match data[] 
*/