import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';


const firebaseConfig = {
   apiKey: "AIzaSyCgQq7oJBQmva2xKUj_TuLsB7CS4ZunoZY",
   authDomain: "skincare-analyzer.firebaseapp.com",
   projectId: "skincare-analyzer",
   storageBucket: "skincare-analyzer.appspot.com",
   messagingSenderId: "942303322650",
   appId: "1:942303322650:web:e0fb8d0b1da5272ce867a3",
   measurementId: "G-92QQXCXELJ"
 };

 //initialize firebase app
const app = initializeApp(firebaseConfig);

//init services
const db = getFirestore(app);
const analytics = getAnalytics(app);

//add new document in collection "users" id auto generated
const docRef = await addDoc(collection(db, "users"),{
  firstname: "George",
  lastname: "Hotz",
  skintype: "Oily"
});
console.log("Document written with ID: ", docRef.id);

