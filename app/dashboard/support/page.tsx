"use client";
import { useState, type FormEvent } from "react";
import { createSupportTicket } from "@/lib/dataconnect/operations";
import Conversations from "@/components/users/conversations";
import { useAuth } from "@/lib/firebase/auth-context";
export default function SupportPage() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const data = new FormData(event.currentTarget);
    try {
      setError("");
      await createSupportTicket({ userId: user.uid, subject: String(data.get("subject") || ""), message: String(data.get("message") || "") });
      event.currentTarget.reset();
      setSent(true);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Le message n'a pas pu être envoyé."); }
  }
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Nous sommes là pour vous</p><h2>Centre d&apos;aide</h2><p>Une question ? Notre équipe vous répond avec plaisir.</p></div></div><div className="support-grid"><div className="faq-card"><h3>Questions fréquentes</h3><details open><summary>Comment suivre mon don ?</summary><p>Vous pouvez retrouver tous vos dons et leurs reçus dans la rubrique « Mes dons ».</p></details><details><summary>Comment déposer une demande d&apos;aide ?</summary><p>Rendez-vous dans « Mes demandes d&apos;aide » puis cliquez sur Nouvelle demande.</p></details><details><summary>Mes données sont-elles protégées ?</summary><p>Nous protégeons vos données et ne les partageons jamais sans votre consentement.</p></details></div><form className="support-form" onSubmit={submit}><h3>Créer un ticket</h3><label>Sujet<select name="subject"><option>Question sur un don</option><option>Ma demande d&apos;aide</option><option>Autre question</option></select></label><label>Votre message<textarea name="message" required rows={5} placeholder="Comment pouvons-nous vous aider ?" /></label>{error && <p className="form-error" role="alert">{error}</p>}{sent && <p className="form-success">Votre ticket a bien été envoyé.</p>}<button className="button">Créer le ticket →</button></form></div><div className="dashboard-section-heading"><div><p className="eyebrow">Échange direct</p><h2>Conversations</h2></div></div><Conversations /></section>;
}
