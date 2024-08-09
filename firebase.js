// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8OOoBb_EEw7lKcr-SZXx4h5wu99vHEkw",
  authDomain: "inventory-management-320e0.firebaseapp.com",
  projectId: "inventory-management-320e0",
  storageBucket: "inventory-management-320e0.appspot.com",
  messagingSenderId: "911788235369",
  appId: "1:911788235369:web:85a2df2683dd0cead360f8",
  measurementId: "G-EEJKGBYZB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}