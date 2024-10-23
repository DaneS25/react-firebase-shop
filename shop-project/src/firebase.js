// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcTlnQn4orrmOx6zqxlH5zx22ffJJYAJI",
  authDomain: "shop-project-4b475.firebaseapp.com",
  projectId: "shop-project-4b475",
  storageBucket: "shop-project-4b475.appspot.com",
  messagingSenderId: "490056038659",
  appId: "1:490056038659:web:675ece6311e38af58ad136",
  measurementId: "G-1G1W5GHDG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };