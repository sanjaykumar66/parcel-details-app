import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE__API_KEY,
    authDomain: import.meta.env.VITE__AUTH_DOMAIN,
    projectId: import.meta.env.VITE__PROJECT_ID,
    storageBucket: import.meta.env.VITE__STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE__MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE__APP_ID,
    databaseURL:import.meta.env.VITE__DATABASE_URL,
    measurementId: import.meta.env.VITE__MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
