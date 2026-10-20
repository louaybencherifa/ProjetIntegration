"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";

export default function SetupAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  if (loading || !user) return <main className="route-loading">Chargement...</main>;
  if (process.env.NODE_ENV !== "development") {
    return <main className="role-choice-page"><div className="auth-card"><h1>Configuration désactivée</h1><p>Cette page est disponible uniquement en développement local.</p></div></main>;
  }

  return <main className="role-choice-page"><div className="auth-card"><span className="auth-icon">✹</span><p className="eyebrow">Configuration interne</p><h1>Accès interne sécurisé</h1><p>Compte connecté : <strong>{user.email}</strong></p><p>Cette page ne permet plus de s&apos;attribuer un rôle interne. Pour créer le premier super-admin, utilisez une procédure d&apos;administration contrôlée, puis affectez les comptes staff et manager depuis l&apos;interface super-admin.</p><button className="button secondary auth-submit" onClick={() => router.push("/dashboard")}>Retour au tableau de bord</button></div></main>;
}
