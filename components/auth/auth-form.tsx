"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { register, resetPassword, signIn, signInWithGoogle } from "@/lib/firebase/auth";
import { publicRoleDefinitions, roleDefinitions, type UserRole } from "@/lib/users/roles";
import { getUserProfile } from "@/lib/users/profile";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [cin, setCin] = useState(""); const [familyId, setFamilyId] = useState(""); const [membersCount, setMembersCount] = useState("1"); const [childrenCount, setChildrenCount] = useState("0"); const [region, setRegion] = useState("");
  const [businessName, setBusinessName] = useState(""); const [taxId, setTaxId] = useState(""); const [category, setCategory] = useState("");
  const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setMessage("");
    try {
      if (mode === "register") {
        const details = role === "beneficiary"
          ? { cin, familyId, headOfFamily: name, membersCount: Number(membersCount), childrenCount: Number(childrenCount), region }
          : role === "partner"
            ? { businessName, taxId, category }
            : undefined;
        if (role === "beneficiary" && (!cin || !familyId || !Number.isInteger(Number(membersCount)) || Number(membersCount) < 1)) {
          throw new Error("Renseignez votre CIN, l'identifiant de famille et un nombre de membres valide.");
        }
        if (role === "partner" && (!businessName || !taxId)) {
          throw new Error("Renseignez le nom de votre entreprise et votre identifiant fiscal.");
        }
        await register(name, email, password, role, details);
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
      {mode === "register" && <fieldset className="role-fieldset"><legend>Comment souhaitez-vous participer ?</legend><div className="role-options">{(Object.entries(publicRoleDefinitions) as Array<[UserRole, typeof roleDefinitions[UserRole]]>).map(([key, definition]) => <button type="button" className={`role-option ${role === key ? "selected" : ""}`} onClick={() => setRole(key)} key={key}><span>{definition.icon}</span><strong>{definition.label}</strong><small>{definition.description}</small></button>)}</div></fieldset>}
      {mode === "register" && role === "beneficiary" && <fieldset className="auth-details"><legend>Informations bénéficiaire</legend><label>CIN<input required value={cin} onChange={(event) => setCin(event.target.value)} placeholder="Votre numéro CIN" /></label><label>Identifiant de famille<input required value={familyId} onChange={(event) => setFamilyId(event.target.value)} placeholder="FAM-001" /></label><label>Nombre de membres<input required min="1" type="number" value={membersCount} onChange={(event) => setMembersCount(event.target.value)} /></label><label>Nombre d&apos;enfants<input min="0" type="number" value={childrenCount} onChange={(event) => setChildrenCount(event.target.value)} /></label><label>Région<input value={region} onChange={(event) => setRegion(event.target.value)} placeholder="Votre région" /></label></fieldset>}
      {mode === "register" && role === "partner" && <fieldset className="auth-details"><legend>Informations partenaire</legend><label>Nom de l&apos;entreprise<input required value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Nom commercial" /></label><label>Identifiant fiscal<input required value={taxId} onChange={(event) => setTaxId(event.target.value)} placeholder="Matricule fiscal" /></label><label>Catégorie de service<input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Alimentation, santé..." /></label></fieldset>}
      <label>Adresse email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" /></label>
      <label>Mot de passe<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="6 caractères minimum" /></label>
      {mode === "login" && <button type="button" className="forgot-link" onClick={forgotPassword}>Mot de passe oublié ?</button>}
      {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success">{message}</p>}
      <button className="button auth-submit" disabled={pending}>{pending ? "Chargement..." : mode === "login" ? "Se connecter →" : "Créer mon compte →"}</button>
    </form>
    <p className="auth-switch">{mode === "login" ? "Vous n'avez pas encore de compte ?" : "Vous avez déjà un compte ?"}{" "}<a href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Créer un compte" : "Se connecter"}</a></p>
    {mode === "login" && <p className="auth-switch"><a href="/setup-admin">Configuration admin locale</a></p>}
  </div>;
}
