/// <reference types="vite/client" />
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM0Io1HIDoF4ZtlX2u8CgTraXPTZ7qn0c",
  authDomain: "gotcg-e7c8b.firebaseapp.com",
  projectId: "gotcg-e7c8b",
  storageBucket: "gotcg-e7c8b.firebasestorage.app",
  messagingSenderId: "784924647824",
  appId: "1:784924647824:web:f277f62cde9903fdf65315",
  measurementId: "G-GT720E1EPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();