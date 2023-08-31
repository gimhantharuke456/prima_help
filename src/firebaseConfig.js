// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCb7Yo6jbsA30D0P8eQEtWLkrNAMeuQw4U",
  authDomain: "marioblog-ad8e5.firebaseapp.com",
  projectId: "marioblog-ad8e5",
  storageBucket: "marioblog-ad8e5.appspot.com",
  messagingSenderId: "134259039673",
  appId: "1:134259039673:web:d7b32a238ef0492bbeea68",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
