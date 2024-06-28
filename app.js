import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCgQq7oJBQmva2xKUj_TuLsB7CS4ZunoZY",
    authDomain: "skincare-analyzer.firebaseapp.com",
    projectId: "skincare-analyzer",
    storageBucket: "skincare-analyzer.appspot.com",
    messagingSenderId: "942303322650",
    appId: "1:942303322650:web:e0fb8d0b1da5272ce867a3"
};

//initialize firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

//Function to handle form submission
async function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElement('email').value;
    const password = document.getElemntById('password').value;

    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        const response = await fetch('/getUserSkinDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        })
    }
}
