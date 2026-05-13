import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function login(email, pass) {
  return await signInWithEmailAndPassword(auth, email, pass);
}

export async function logout() {
  await signOut(auth);
}
