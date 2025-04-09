// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Конфигурация Firebase для вашего веб-приложения
const firebaseConfig = {
  apiKey: "AIzaSyA8jD4dnuPK39wD-drr7pNU_3DRwCwiv3M",
  authDomain: "skoipt-chat.firebaseapp.com",
  projectId: "skoipt-chat",
  storageBucket: "skoipt-chat.appspot.com",
  messagingSenderId: "327706669995",
  appId: "1:327706669995:web:240a135b8ed11d993798ee",
  measurementId: "G-MJ705K8D47"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db }; 