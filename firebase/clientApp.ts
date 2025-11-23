// firebase/clientApp.ts

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBx2wBczXbY9arLlyc7VnSqJebCjZ4LOkQ",
  authDomain: "oathz-cloud.firebaseapp.com",
  projectId: "oathz-cloud",
  storageBucket: "oathz-cloud.firebasestorage.app",
  messagingSenderId: "943557578806",
  appId: "1:943557578806:web:15e8a352c3c41da4ce4897",
  measurementId: "G-R5YQZF0RLX",
};

// Prevent Firebase re-initializing (Next.js hot reload fix)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
