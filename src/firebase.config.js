
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXhpW1yKg1Ft07fTcr_mgRFyFU1Jfh4FM",
    authDomain: "bike-marketplace-app.firebaseapp.com",
    projectId: "bike-marketplace-app",
    storageBucket: "bike-marketplace-app.appspot.com",
    messagingSenderId: "390631004487",
    appId: "1:390631004487:web:14ce6cdefc333aa20b5462"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();