// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
// Add this import
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCgC-S8GFxkK2LfRCodi1qLTbZuzW5uJJw',
  authDomain: 'walterscube-b3767.firebaseapp.com',
  databaseURL: 'https://walterscube-b3767.firebaseio.com',
  projectId: 'walterscube-b3767',
  storageBucket: 'walterscube-b3767.appspot.com',
  messagingSenderId: '482799415653',
  appId: '1:482799415653:web:bd08a161e168d56e46318c',
  measurementId: 'G-RQGHSH7H81',
};

// --- init ---
const app        = initializeApp(firebaseConfig);
const analytics  = getAnalytics(app);
const auth       = getAuth(app);
const provider   = new GoogleAuthProvider();
const functions  = getFunctions(app);
// Initialize storage
const storage    = getStorage(app);

export { app, analytics, auth, provider, functions, storage };
