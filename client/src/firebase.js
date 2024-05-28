// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//console.log(import.meta.env.VITE_FIREBASE_API_KEY )
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-blog-43d1a.firebaseapp.com",
  projectId: "mern-blog-43d1a",
  storageBucket: "mern-blog-43d1a.appspot.com",
  messagingSenderId: "527455415640",
  appId: "1:527455415640:web:e03d6f33ec8829bbfec92d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);