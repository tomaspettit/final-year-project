/// <reference types="vite/client" />
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTb8B0zbUM2IIjtXqG6lkuORjNTHY5tLs",
  authDomain: "gotcg-chess.firebaseapp.com",
  projectId: "gotcg-chess",
  storageBucket: "gotcg-chess.firebasestorage.app",
  messagingSenderId: "229886622395",
  appId: "1:229886622395:web:ea211b9270567f8a49479e",
  measurementId: "G-JD04HC2EFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();