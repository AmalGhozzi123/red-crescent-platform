import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "xxxxxxx",
  appId: "xxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
