import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAIBaXBCPI88rDX97c1-73WxZd_T6RG_Z4",
  authDomain: "frontend-905b0.firebaseapp.com",
  databaseURL: "https://frontend-905b0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "frontend-905b0",
  storageBucket: "frontend-905b0.appspot.com", 
  messagingSenderId: "376711394133",
  appId: "1:376711394133:web:36857a1822ab927ee3b5dc",
  measurementId: "G-QBET3K6095",
};

// evita doppia inizializzazione (Next dev mode)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getDatabase(app);
