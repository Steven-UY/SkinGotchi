import { signInWithEmailAndPassword } from 'firebase/auth';

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
      // Send token to backend
      sendTokenToBackend(idToken);
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

function sendTokenToBackend(token) {
  // Send token to the backend
  fetch('/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // Handle successful verification (e.g., redirect to dashboard)
  })
  .catch((error) => {
    console.error('Error: ', error);
  });
}