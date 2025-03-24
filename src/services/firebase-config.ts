// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
import 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQtpbxiCD9PVNuAkN9HAQ7-o6xst3FEjA",
  authDomain: "ireland-mosques-6f154.firebaseapp.com",
  projectId: "ireland-mosques-6f154",
  storageBucket: "ireland-mosques-6f154.firebasestorage.app",
  messagingSenderId: "350080594094",
  appId: "1:350080594094:web:f869f6985790baa1c53d3f",
  measurementId: "G-J6L2K11L0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

