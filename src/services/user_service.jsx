import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useContext } from "react";

export const getUsers = async () => {};

export const createUser = async () => {};

export const createAdmin = async (email, password, name) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (user) => {
      const data = { email, name, role: "admin" };
      await setDoc(doc(db, "users", email), data).catch((err) => {
        throw Error(`${err}`);
      });
    })
    .catch((err) => {
      throw Error(`${err}`);
    });
};

export const getAdmins = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const querySnapshot = await getDocs(q);
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    return docs;
  } catch (error) {
    throw Error(`${error}`);
  }
};

export const deleteAdmin = async () => {
  const uid = localStorage.getItem("selected_value");

  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (err) {
    throw Error(`${err}`);
  }
};
