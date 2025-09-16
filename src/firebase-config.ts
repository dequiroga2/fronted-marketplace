import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-dhtsTvIGhONKCQhqkG8u-E_T526RgE4",
  authDomain: "marketplaceia.firebaseapp.com",
  projectId: "marketplaceia",
  storageBucket: "marketplaceia.firebasestorage.app",
  messagingSenderId: "633137860511",
  appId: "1:633137860511:web:0fd02774804c952050b7aa",
  measurementId: "G-W29BLTJ11Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);