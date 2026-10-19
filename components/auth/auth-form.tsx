"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { register, resetPassword, signIn, signInWithGoogle } from "@/lib/firebase/auth";
import { roleDefinitions, type UserRole } from "@/lib/users/roles";
import { getUserProfile } from "@/lib/users/profile";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setMessage("");
    try {
      if (mode === "register") {
        await register(name, email, password, role);
        window.location.assign(roleDefinitions[role].home);
      } else {
        const credential = await signIn(email, password);
        const profile = await getUserProfile(credential.user.uid);
        router.push(profile?.role && roleDefinitions[profile.role] ? roleDefinitions[profile.role].home : "/choose-role");
      }
    }
    catch (caught) { setError(getAuthErrorMessage(caught)); } finally { setPending(false); }
  }
  async function googleLogin() {
    setPending(true); setError("");
    try {
      const credential = await signInWithGoogle(mode === "register" ? role : undefined);
      if (mode === "register") window.location.assign(roleDefinitions[role].home);
      else {
        const profile = await getUserProfile(credential.user.uid);
        router.push(profile?.role && roleDefinitions[profile.role] ? roleDefinitions[profile.role].home : "/choose-role");
      }
    } catch (caught) { setError(getAuthErrorMessage(caught)); } finally { setPending(false); }
  }
  async function forgotPassword() {
    if (!email) { setError("Saisissez votre adresse email pour recevoir le lien."); return; }
    try { await resetPassword(email); setMessage("Un lien de réinitialisation vous a été envoyé."); } catch (caught) { setError(getAuthErrorMessage(caught)); }
  }
  return <div className="auth-card">
    <div className="auth-card-heading"><span className="auth-icon">♡</span><p className="eyebrow">Solidarité, ensemble</p><h1>{mode === "login" ? "Bienvenue à nouveau." : "Rejoignez le mouvement."}</h1><p>{mode === "login" ? "Connectez-vous pour retrouver votre espace personnel." : "Créez votre espace pour donner, demander de l'aide et suivre votre impact."}</p></div>
    <button className="google-button" onClick={googleLogin} disabled={pending}>Continuer avec Google</button>
    <div className="auth-divider"><span>ou avec votre email</span></div>
    <form onSubmit={submit} className="auth-form">
      {mode === "register" && <label>Nom complet<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Votre nom" /></label>}
      {mode === "register" && <fieldset className="role-fieldset"><legend>Comment souhaitez-vous participer ?</legend><div className="role-options">{(Object.entries(roleDefinitions) as Array<[UserRole, typeof roleDefinitions[UserRole]]>).map(([key, definition]) => <button type="button" className={`role-option ${role === key ? "selected" : ""}`} onClick={() => setRole(key)} key={key}><span>{definition.icon}</span><strong>{definition.label}</strong><small>{definition.description}</small></button>)}</div></fieldset>}
      <label>Adresse email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" /></label>
      <label>Mot de passe<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="6 caractères minimum" /></label>
      {mode === "login" && <button type="button" className="forgot-link" onClick={forgotPassword}>Mot de passe oublié ?</button>}
      {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success">{message}</p>}
      <button className="button auth-submit" disabled={pending}>{pending ? "Chargement..." : mode === "login" ? "Se connecter →" : "Créer mon compte →"}</button>
    </form>
    <p className="auth-switch">{mode === "login" ? "Vous n'avez pas encore de compte ?" : "Vous avez déjà un compte ?"}{" "}<a href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Créer un compte" : "Se connecter"}</a></p>
  </div>;
}
