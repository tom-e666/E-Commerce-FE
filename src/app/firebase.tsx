import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD8kWI1fZAcQjcXUzYsYfQrNn7-lLCO__A",
  authDomain: "ecommerce-da2c8.firebaseapp.com",
  projectId: "ecommerce-da2c8",
  storageBucket: "ecommerce-da2c8.firebasestorage.app",
  messagingSenderId: "533306985399",
  appId: "1:533306985399:web:0a9d6e03b7b44b3d44c2f0",
  measurementId: "G-M9FJY8LGEV"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
