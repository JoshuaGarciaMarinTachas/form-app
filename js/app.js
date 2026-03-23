import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function pruebaFirebase() {
  await addDoc(collection(db, "test"), {
    mensaje: "Hola desde mi app",
    fecha: new Date(),
  });

  console.log("✅ Datos enviados correctamente");
}

pruebaFirebase();
