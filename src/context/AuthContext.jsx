import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

async function assertActive(user) {
  const snap = await getDoc(doc(db, "users", user.uid)).catch(() => null);
  if (snap && snap.exists() && snap.data().is_active === false) {
    await signOut(auth).catch(() => {});
    const err = new Error("Account disabled");
    err.code = "account-disabled";
    throw err;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountDisabled, setAccountDisabled] = useState(false);

  async function signup({ firstName, lastName, email, contactNumber, dob, password }) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const displayName = `${firstName} ${lastName}`.trim();
    await updateProfile(result.user, { displayName });
    await setDoc(doc(db, "users", result.user.uid), {
      first_name: firstName,
      last_name: lastName,
      email,
      contact_number: contactNumber,
      dob,
      is_active: true,
      is_verified: false,
      failed_login_attempts: 0,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      last_login_at: null,
      last_password_change: serverTimestamp(),
    });
    try {
      await sendEmailVerification(result.user);
    } catch {
      // Non-fatal.
    }
    return result;
  }

  async function login(email, password) {
    let result;
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      // Track failed attempt on the backend (best-effort, non-blocking)
      fetch("/api/auth/login-failed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      throw err;
    }
    await assertActive(result.user);
    const idToken = await result.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    });
    return result;
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    return signOut(auth);
  }

  function resetPassword(email, continueUrl) {
    const actionCodeSettings = continueUrl ? { url: continueUrl } : undefined;
    return sendPasswordResetEmail(auth, email, actionCodeSettings);
  }

  async function resendVerification() {
    if (!auth.currentUser) throw new Error("Not signed in");
    await sendEmailVerification(auth.currentUser);
  }

  async function changePassword(currentPassword, newPassword) {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("Not signed in");
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    // Update last_password_change, then revoke all other sessions
    updateDoc(doc(db, "users", user.uid), {
      last_password_change: serverTimestamp(),
      updated_at: serverTimestamp(),
    }).catch(() => {});
    await fetch("/api/auth/revoke", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    return signOut(auth);
  }

  async function deleteAccount() {
    const res = await fetch("/api/auth/account", {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete account");
    return signOut(auth);
  }

  async function googleSignIn() {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    });
    const userRef = doc(db, "users", result.user.uid);
    const snap = await getDoc(userRef).catch(() => null);
    if (!snap || !snap.exists()) {
      const parts = (result.user.displayName || "").trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      await setDoc(userRef, {
        first_name: firstName,
        last_name: lastName,
        email: (result.user.email || "").toLowerCase(),
        contact_number: result.user.phoneNumber || "",
        dob: "",
        is_active: true,
        is_verified: result.user.emailVerified,
        failed_login_attempts: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        last_login_at: serverTimestamp(),
        last_password_change: serverTimestamp(),
      }).catch(() => {});
    } else {
      if (snap.data().is_active === false) {
        await signOut(auth).catch(() => {});
        const err = new Error("Account disabled");
        err.code = "account-disabled";
        throw err;
      }
    }
    return result;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid)).catch(() => null);
        if (snap && snap.exists() && snap.data().is_active === false) {
          await signOut(auth).catch(() => {});
          setAccountDisabled(true);
          setCurrentUser(null);
          setLoading(false);
          return;
        }
      }
      setAccountDisabled(false);
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    accountDisabled,
    signup,
    login,
    logout,
    resetPassword,
    resendVerification,
    changePassword,
    deleteAccount,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
