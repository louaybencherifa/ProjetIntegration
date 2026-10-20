"use client";

import { useEffect, useState } from "react";
import { listDonationsForUser } from "@/lib/dataconnect/operations";
import type { DonationRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function DonorImpactPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    listDonationsForUser(user.uid).then((result) => setDonations(result.donations)).catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de calculer votre impact."));
  }, [user]);

  const confirmed = donations.filter((donation) => donation.status === "CONFIRMED");
  const total = confirmed.reduce((sum, donation) => sum + donation.amount, 0);
  const projects = new Set(confirmed.map((donation) => donation.campaign?.name || donation.association?.name).filter(Boolean)).size;
  const families = Math.floor(total / 25);

  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Votre générosité</p><h2>Mon impact</h2><p>Chaque contribution confirmée raconte une histoire de solidarité.</p></div></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="impact-section impact-inline"><div className="impact-header"><div><p className="eyebrow light-eyebrow">Impact calculé depuis vos dons confirmés</p><h2>{families} familles<br /><em>estimées accompagnées.</em></h2></div></div><div className="stats-grid"><div className="stat"><strong>{total.toFixed(2)} €</strong><span>contributions confirmées</span></div><div className="stat"><strong>{projects}</strong><span>projets ou associations soutenus</span></div><div className="stat"><strong>{confirmed.length}</strong><span>dons confirmés</span></div></div></div></section>;
}
