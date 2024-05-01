'use client'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDZF1-ipAZ81EENp2NtdxRlrq6V7FmWX4s",
  authDomain: "fir-1-81fde.firebaseapp.com",
  databaseURL: "https://fir-1-81fde.firebaseio.com",
  projectId: "fir-1-81fde",
  storageBucket: "fir-1-81fde.appspot.com",
  messagingSenderId: "445926783318",
  appId: "1:445926783318:web:59e04682d5e8c078bffef7"
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase
export const auth = getAuth(app);
export const Database = getDatabase(app);