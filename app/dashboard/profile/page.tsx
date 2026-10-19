"use client";
import { useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { getUserLabel } from "@/lib/firebase/auth";
export default function ProfilePage() {
  const { user } = useAuth(); const [saved, setSaved] = useState(false);
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Mes informations</p><h2>Mon profil</h2><p>Gérez vos informations personnelles et vos préférences.</p></div></div><form className="profile-card" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><div className="profile-heading"><span className="large-avatar">{getUserLabel(user).slice(0, 1).toUpperCase()}</span><div><h3>{getUserLabel(user)}</h3><p>{user?.email}</p></div></div><div className="profile-fields"><label>Nom complet<input defaultValue={user?.displayName || ""} /></label><label>Adresse email<input disabled value={user?.email || ""} readOnly /></label><label>Téléphone<input placeholder="+216 00 000 000" /></label><label>Région<input placeholder="Votre région" /></label></div>{saved && <p className="form-success">Vos informations ont été enregistrées.</p>}<button className="button">Enregistrer les modifications →</button></form></section>;
}
