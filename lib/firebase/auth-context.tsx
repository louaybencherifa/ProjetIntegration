"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { auth } from "@/lib/firebase/auth";
import { getUserProfile } from "@/lib/users/profile";
import { isUserRole, type UserRole } from "@/lib/users/roles";

type AuthContextValue = { user: User | null; role: UserRole | null; loading: boolean };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      const profile = await getUserProfile(nextUser.uid);
      setRole(isUserRole(profile?.role) ? profile.role : null);
    } else {
      setRole(null);
    }
    setLoading(false);
  }), []);
  return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
