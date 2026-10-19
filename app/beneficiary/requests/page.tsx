"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listAidRequestsForUser } from "@/lib/dataconnect/operations";
import type { AidRequestRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function BeneficiaryRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AidRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    listAidRequestsForUser(user.uid)
      .then((result) => setRequests(result.aidRequests))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos demandes."))
      .finally(() => setLoading(false));
  }, [user]);
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Votre accompagnement</p><h2>Mes demandes</h2><p>Suivez l&apos;avancement de vos dossiers en toute confidentialité.</p></div><Link className="button" href="/beneficiary/requests/new">+ Nouvelle demande</Link></div>{error && <p className="form-error" role="alert">{error}</p>}{loading && <p className="route-loading">Chargement de vos demandes...</p>}{!loading && requests.length === 0 && <div className="empty-request"><span>＋</span><h3>Aucune demande enregistrée</h3><p>Notre équipe est là pour vous accompagner.</p><Link className="text-link dark-link" href="/beneficiary/requests/new">Créer une demande →</Link></div>}{requests.map((request) => <div className="request-card" key={request.reference}><div className="request-card-top"><span className="request-icon">◒</span><span className={`pill ${request.status === "APPROVED" ? "confirmed" : "review"}`}>{request.status}</span></div><h3>{request.type}</h3><p>Demande #{request.reference} · {request.association?.name || "Association en cours d'affectation"}</p><div className="progress"><span /></div><small>{request.description || "Votre dossier est suivi par notre équipe."}</small></div>)}</section>;
}
