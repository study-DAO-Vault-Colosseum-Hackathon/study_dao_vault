import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCOqsyQBTqwLvurF6v_VnIyCJKWE64B7PQ",
  authDomain: "study-dao.firebaseapp.com",
  projectId: "study-dao",
  storageBucket: "study-dao.firebasestorage.app",
  messagingSenderId: "55043378418",
  appId: "1:55043378418:web:a97b9734cfc2c98402546b",
  measurementId: "G-QMQBF642ND"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();