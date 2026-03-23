import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHCbVYMWYzgoM_ihBjbbeSS3LeZFkDZe0",
  authDomain: "form-app-1a7a0.firebaseapp.com",
  projectId: "form-app-1a7a0",
  storageBucket: "form-app-1a7a0.firebasestorage.app",
  messagingSenderId: "957092219238",
  appId: "1:957092219238:web:524beda02119026900a0a7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);