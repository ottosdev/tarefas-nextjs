// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6TS_2Fw-smssWiQHSPxsELGDn8_voPIw",
  authDomain: "tasks-88526.firebaseapp.com",
  projectId: "tasks-88526",
  storageBucket: "tasks-88526.appspot.com",
  messagingSenderId: "750227820945",
  appId: "1:750227820945:web:9af31eaf7f5cec7fe6ca30",
  measurementId: "G-HMZWMB76CT"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export {db}
