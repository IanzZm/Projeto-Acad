import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMGZoh962_1zZ0DgLlWFzZ2nuUyrPvHQM",
  authDomain: "indiopersonal-cc705.firebaseapp.com",
  projectId: "indiopersonal-cc705",
  storageBucket: "indiopersonal-cc705.firebasestorage.app",
  messagingSenderId: "234234931495",
  appId: "1:234234931495:web:531a67cd07f69e1779e102",
  measurementId: "G-1BE9ESNRH3"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();