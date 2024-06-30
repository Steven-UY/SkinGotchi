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

async function authenticateAndGetToken(email, password) {
  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get the ID token
    const idToken = await user.getIdToken();

    console.log('ID Token:', idToken);
    return idToken;
  } catch (error) {
    console.error('Error during authentication:', error);
  }
}

async function testServer(idToken, email) {
  try {
    // Send a request to the backend with the ID token only
    const response = await fetch('http://localhost:3000/verifyToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ email })
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

// Example usage with a test user
const testEmail = 'testuser@example.com';
const testPassword = 'testpassword';

authenticateAndGetToken(testEmail, testPassword).then(({ idToken, email }) => {
  if (idToken) {
    testServer(idToken, email);
  }
});

