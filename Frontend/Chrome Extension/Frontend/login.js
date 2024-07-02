// Import and configure Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgQq7oJBQmva2xKUj_TuLsB7CS4ZunoZY",
  authDomain: "skincare-analyzer.firebaseapp.com",
  projectId: "skincare-analyzer",
  storageBucket: "skincare-analyzer.appspot.com",
  messagingSenderId: "942303322650",
  appId: "1:942303322650:web:e0fb8d0b1da5272ce867a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle form submission
async function handleSignIn(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Authenticate the user and get the ID token
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();
  
    // Send a request to the backend with the ID token only
    const response = await fetch('/verifyToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    console.log('User details:', data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

//Add event listener to the form
document.getElementById('sign-in-form').addEventListener('submit', handleSignIn);
