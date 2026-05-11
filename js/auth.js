import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

export async function login(email, pass) {
  return await signInWithEmailAndPassword(auth, email, pass);
}
