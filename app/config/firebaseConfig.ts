import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBQA_is8Wnu1dkLv66TkiMUcvlvQwBbvp8",
    authDomain: "rtu-adas.firebaseapp.com",
    projectId: "rtu-adas",
    storageBucket: "rtu-adas.firebasestorage.app",
    messagingSenderId: "229704053479",
    appId: "1:229704053479:web:6edb2d5c98aec0e8ede842"
};

//aaabbb
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(firebaseApp);