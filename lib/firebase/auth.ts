import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { firebaseApp } from "@/lib/firebase/client";
import { saveUserProfile } from "@/lib/users/profile";
import type { UserRole } from "@/lib/users/roles";

export const auth = getAuth(firebaseApp);

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function register(name: string, email: string, password: string, role: UserRole, details?: Parameters<typeof saveUserProfile>[0]["beneficiary"] | Parameters<typeof saveUserProfile>[0]["supplier"]) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: name.trim() });
  await saveUserProfile({
    uid: credential.user.uid,
    role,
    fullName: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
    ...(role === "beneficiary" ? { beneficiary: details as Parameters<typeof saveUserProfile>[0]["beneficiary"] } : {}),
    ...(role === "partner" ? { supplier: details as Parameters<typeof saveUserProfile>[0]["supplier"] } : {}),
  });
  return credential;
}

export async function signInWithGoogle(role?: UserRole) {
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
  if (role) {
    await saveUserProfile({
      uid: credential.user.uid,
      role,
      fullName: credential.user.displayName || credential.user.email?.split("@")[0] || "Utilisateur",
      email: credential.user.email || "",
      createdAt: new Date().toISOString(),
    });
  }
  return credential;
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export function logOut() {
  return signOut(auth);
}

export function getUserLabel(user: User | null) {
  return user?.displayName || user?.email?.split("@")[0] || "Utilisateur";
}
