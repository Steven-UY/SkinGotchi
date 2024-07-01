// Import and configure Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
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
