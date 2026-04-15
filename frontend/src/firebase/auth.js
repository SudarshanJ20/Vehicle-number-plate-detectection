import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

// ── Sign Up ───────────────────────────────────────────────────────────────────
export const signUp = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  // Create user doc in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    createdAt: serverTimestamp(),
    totalDetections: 0,
    plan: "free",
  });

  return user;
};

// ── Sign In ───────────────────────────────────────────────────────────────────
export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// ── Google Sign In ────────────────────────────────────────────────────────────
export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Create user doc if first time
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
      totalDetections: 0,
      plan: "free",
    });
  }

  return user;
};

// ── Sign Out ──────────────────────────────────────────────────────────────────
export const logOut = async () => {
  await signOut(auth);
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
