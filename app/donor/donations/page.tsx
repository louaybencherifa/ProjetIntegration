"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listDonationsForUser } from "@/lib/dataconnect/operations";
import type { DonationRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default function DonorDonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    listDonationsForUser(user.uid)
      .then((result) => setDonations(result.donations))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos dons."))
      .finally(() => setLoading(false));
  }, [user]);

  const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Espace donateur</p><h2>Mes dons</h2><p>Gérez vos contributions et retrouvez vos reçus.</p></div><Link className="button" href="/#don">Faire un don →</Link></div><div className="summary-strip"><div><span>Total donné</span><strong>{total.toFixed(2)} €</strong></div><div><span>Contributions</span><strong>{donations.length}</strong></div><div><span>Confirmés</span><strong>{donations.filter((donation) => donation.status === "CONFIRMED").length}</strong></div></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="table-card"><div className="table-heading"><strong>Historique des dons</strong><span>{loading ? "Chargement..." : `${donations.length} contributions`}</span></div>{!loading && donations.length === 0 && <div className="empty-request"><span>♡</span><h3>Aucun don enregistré</h3><p>Vos contributions apparaîtront ici après confirmation.</p></div>}{donations.map((donation) => <div className="donation-row" key={donation.reference}><span className="donation-date">♡<br /><small>{donation.method}</small></span><div><strong>{donation.campaign?.name || donation.association?.name || "Don solidaire"}</strong><small>{formatDate(donation.submittedAt)} · {donation.reference}</small></div><b>{donation.amount.toFixed(2)} €</b><span className={`pill ${donation.status === "CONFIRMED" ? "confirmed" : "review"}`}>{donation.status === "CONFIRMED" ? "Confirmé" : donation.status === "REFUSED" ? "Refusé" : "En attente"}</span></div>)}</div></section>;
}
