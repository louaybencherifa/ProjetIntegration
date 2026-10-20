"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getDataConnectUser, updateUserSettings } from "@/lib/dataconnect/operations";
import { useAuth } from "@/lib/firebase/auth-context";

export default function AccountProfileForm({ label }: { label: string }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");
  const [notifyEmailSms, setNotifyEmailSms] = useState(true);
  const [whatsappReminders, setWhatsappReminders] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getDataConnectUser(user.uid).then((result) => {
      const profile = result.users[0];
      if (!profile) return;
      setFullName(profile.fullName);
      setEmail(profile.email);
      setPhone(profile.phone || "");
      setRegion(profile.region || "");
      setAddress(profile.address || "");
      setNotifyEmailSms(profile.notifyEmailSms);
      setWhatsappReminders(profile.whatsappReminders);
    }).catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger votre profil."));
  }, [user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setPending(true); setError(""); setMessage("");
    try {
      await updateUserSettings({ id: user.uid, fullName, phone, region, address, notifyEmailSms, whatsappReminders });
      setMessage("Votre profil a été mis à jour.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de mettre à jour votre profil.");
    } finally {
      setPending(false);
    }
  }

  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">{label}</p><h2>Mon profil</h2><p>Gérez vos coordonnées et vos préférences de communication.</p></div></div><form className="profile-card profile-fields" onSubmit={submit}><label>Nom complet<input required value={fullName} onChange={(event) => setFullName(event.target.value)} /></label><label>Email<input disabled type="email" value={email} /></label><label>Téléphone<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+216 ..." /></label><label>Région<input value={region} onChange={(event) => setRegion(event.target.value)} /></label><label className="profile-wide">Adresse<input value={address} onChange={(event) => setAddress(event.target.value)} /></label><label className="checkbox-field profile-wide"><input type="checkbox" checked={notifyEmailSms} onChange={(event) => setNotifyEmailSms(event.target.checked)} /> Recevoir les notifications par email et SMS</label><label className="checkbox-field profile-wide"><input type="checkbox" checked={whatsappReminders} onChange={(event) => setWhatsappReminders(event.target.checked)} /> Recevoir les rappels WhatsApp</label>{error && <p className="form-error profile-wide" role="alert">{error}</p>}{message && <p className="form-success profile-wide" role="status">{message}</p>}<button className="button profile-wide" disabled={pending}>{pending ? "Enregistrement..." : "Enregistrer les modifications"}</button></form></section>;
}
