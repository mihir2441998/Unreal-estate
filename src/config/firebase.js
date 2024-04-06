// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "unreal-estate-6d962.firebaseapp.com",
  projectId: "unreal-estate-6d962",
  storageBucket: "unreal-estate-6d962.appspot.com",
  messagingSenderId: "1015095224697",
  appId: "1:1015095224697:web:f4fd4f78f27405caf6e7a8",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore(app);
