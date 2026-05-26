import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Configurações do Firebase para o projeto (Endereços e chaves de acesso)
const firebaseConfig = {
  apiKey: "AIzaSyAMGZoh962_1zZ0DgLlWFzZ2nuUyrPvHQM",
  authDomain: "indiopersonal-cc705.firebaseapp.com",
  projectId: "indiopersonal-cc705",
  storageBucket: "indiopersonal-cc705.firebasestorage.app",
  messagingSenderId: "234234931495",
  appId: "1:234234931495:web:531a67cd07f69e1779e102",
  measurementId: "G-1BE9ESNRH3"
};


//liga o projeto ao firebase
const app = initializeApp(firebaseConfig);

//liga o projeto ao analytics do firebase
export const analytics = getAnalytics(app);

//liga o projeto ao auth para login cadastro e autenticação do firebase
export const auth = getAuth(app);

//liga o projeto ao provider do google para login com google do firebase
export const provider = new GoogleAuthProvider();

//liga o projeto ao firestore para banco de dados do firebase
export const db = getFirestore(app);
