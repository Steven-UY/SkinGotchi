import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCgQq7oJBQmva2xKUj_TuLsB7CS4ZunoZY",
    authDomain: "skincare-analyzer.firebaseapp.com",
    projectId: "skincare-analyzer",
    storageBucket: "skincare-analyzer.appspot.com",
    messagingSenderId: "942303322650",
    appId: "1:942303322650:web:e0fb8d0b1da5272ce867a3",
    measurementId: "G-92QQXCXELJ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
