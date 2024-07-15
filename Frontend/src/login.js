import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './login.css';

// Get form element
const signInForm = document.getElementById('sign-in-form');

// Add event listener
signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  loginAndGetToken(email, password)
  .then((idToken) => {
    console.log("Login successful. ID token:", idToken);
    // Save the token (e.g., in local storage)
    localStorage.setItem('idToken', idToken);
  })
    .catch((error) => {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    });
});

function loginAndGetToken(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.getIdToken(true);
    });
}

// Function to read user data using the token
function readUserData(token) {
  return fetch(`http://localhost:8080/read/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include token in Authorization header
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      return data.data; // Return the user data
    } else {
      throw new Error(data.error || 'Failed to read user data');
    }
  });
}