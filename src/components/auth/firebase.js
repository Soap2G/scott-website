import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "scott-website-67911.firebaseapp.com",
    projectId: "scott-website-67911",
    storageBucket: "scott-website-67911.appspot.com",
    messagingSenderId: "321084309713",
    appId: "1:321084309713:web:2ebb77d08d807cb5ab05f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export const firebaseAuth = { signInWithEmailAndPassword };
export const db = getFirestore(app);

// Export the whole Firebase app if needed
export default app;
