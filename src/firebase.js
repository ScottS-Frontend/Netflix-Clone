//cSpell:ignore firebaseapp, firebasestorage, firestore, Phhx
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyD2VPhhxOezI-Mxi94xMjbWPJ2cM4OjERU",
  authDomain: "netflix-clone-8e5c1.firebaseapp.com",
  projectId: "netflix-clone-8e5c1",
  storageBucket: "netflix-clone-8e5c1.firebasestorage.app",
  messagingSenderId: "215479578547",
  appId: "1:215479578547:web:127fa3100dd6ed8b17e5c6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, db, login, signup, logout };
