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
    return storeTokenInCookie(idToken);
  })
  .then(() => {
    console.log("Token stored in cookie, now reading user data");
    return readUserData();
  })
  .then((userData) => {
    console.log("User Data:", userData);
  })
  .catch((error) => {
    console.error("Login failed:", error);
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

function storeTokenInCookie(token) {
  console.log('Storing token in cookie:', token); // Debugging line
  return fetch('http://localhost:8080/storeToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    credentials: 'include' // Ensure credentials are included
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to store token in cookie');
    }
  });
}


function readUserData() {
  return fetch(`http://localhost:8080/read/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' // This is correct, keep it
  })
  .then(response => {
    if (!response.ok) {
      console.error('Response status:', response.status);
      return response.text().then(text => {
        throw new Error(`Network response was not ok: ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log("Received data:", data);
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to read user data');
    }
  });
}