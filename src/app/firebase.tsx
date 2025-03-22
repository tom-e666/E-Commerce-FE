import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlc3u9fY7t9H-mabz9UAB5Tz1jFW_e498",
  authDomain: "e-commerce-8bf03.firebaseapp.com",
  projectId: "e-commerce-8bf03",
  storageBucket: "e-commerce-8bf03.firebasestorage.app",
  messagingSenderId: "392067813677",
  appId: "1:392067813677:web:b5b76104f6dd65a6b583a4",
  measurementId: "G-L817WZ496F"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
