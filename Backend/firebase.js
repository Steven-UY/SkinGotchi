import { initializeApp } from 'firebase/app';
import config from './config.js';

//initialize firebase app with config from env file
const firebase = initializeApp(config.firebaseConfig);

export default firebase;