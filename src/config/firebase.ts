import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCAzM0863C9KlNW3-KiCZBCmOb5o01zgcI",
  authDomain: "beanshub-d9394.firebaseapp.com",
  projectId: "beanshub-d9394",
  storageBucket: "beanshub-d9394.firebasestorage.app",
  messagingSenderId: "790378356759",
  appId: "1:790378356759:web:a9399af7b94feba34f3c52",
  measurementId: "G-B90H1RZ581"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;