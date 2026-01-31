import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDgdCFSBwG1KC2Dr_NSUr_84tiJpCUeFLA",
    authDomain: "student-complaint-portal-f40c0.firebaseapp.com",
    projectId: "student-complaint-portal-f40c0",
    storageBucket: "student-complaint-portal-f40c0.firebasestorage.app",
    messagingSenderId: "406320277895",
    appId: "1:406320277895:web:63400abbe5c0d1750a8b22",
    measurementId: "G-5Q0410SGXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;
