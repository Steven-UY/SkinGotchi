import firebase from '../firebase.js';
import User from '../models/userModel.js';

//importing firestore methods
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

//creating an instance of firestore 
const db = getFirestore(firebase);

//function to create user 
export const createUser = async (req, res, next) => {
  try{
    const data = req.body;
    await addDoc(collection(db, 'users'), data);
    res.status(200).send('user created successfully');
  } catch(error){
    res.status(400).send(error.message);
  }
}