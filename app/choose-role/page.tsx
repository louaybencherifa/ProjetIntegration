"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { roleDefinitions, type UserRole } from "@/lib/users/roles";
import { saveUserProfile } from "@/lib/users/profile";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";

export default function ChooseRolePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function choose(role: UserRole) {
    if (!user) return router.replace("/login");
    setPending(true);
    setError("");
    try {
      await saveUserProfile({ uid: user.uid, role, fullName: user.displayName || "Utilisateur", email: user.email || "", createdAt: new Date().toISOString() });
      window.location.assign(roleDefinitions[role].home);
    } catch (caught) {
      setError(getAuthErrorMessage(caught));
      setPending(false);
    }
  }
  if (loading) return <div className="route-loading">Chargement...</div>;
  return <main className="role-choice-page"><div className="auth-card"><span className="auth-icon">♡</span><p className="eyebrow">Votre espace Solidarité</p><h1>Choisissez votre parcours.</h1><p>Cette information nous aide à vous présenter les bons outils. Vous pourrez compléter votre profil ensuite.</p><div className="role-options role-choice-options">{(Object.entries(roleDefinitions) as Array<[UserRole, typeof roleDefinitions[UserRole]]>).map(([key, definition]) => <button className="role-option" disabled={pending} onClick={() => choose(key)} key={key}><span>{definition.icon}</span><strong>{definition.label}</strong><small>{definition.description}</small></button>)}</div>{error && <p className="form-error" role="alert">{error}</p>}</div></main>;
}
