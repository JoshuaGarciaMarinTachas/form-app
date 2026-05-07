import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function initConfig() {
  const toggle = document.getElementById("toggleForm");
  const ref = doc(db, "config", "formulario");

  getDoc(ref).then((snap) => {
    if (snap.exists()) {
      toggle.checked = snap.data().habilitado;
    }
  });

  toggle.addEventListener("change", async () => {
    await setDoc(ref, { habilitado: toggle.checked });
  });
}
