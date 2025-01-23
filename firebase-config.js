// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkg_MfKPKj6DpvX9Jw_3qzr8wzIUdYaYs",
  authDomain: "rocodromo-71c85.firebaseapp.com",
  projectId: "rocodromo-71c85",
  storageBucket: "rocodromo-71c85.firebasestorage.app",
  messagingSenderId: "1046263685630",
  appId: "1:1046263685630:web:cebb2215c391a31513e0af",
  measurementId: "G-G96XNS8TJV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);  

// Inicializar Firestore
const db = getFirestore(app); 

export { auth, db, analytics, app };
