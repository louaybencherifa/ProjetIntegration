"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listAidRequestsForUser, listDonationsForUser } from "@/lib/dataconnect/operations";
import { useAuth } from "@/lib/firebase/auth-context";
import { roleDefinitions, type UserRole } from "@/lib/users/roles";

export default function RoleHome({ role }: { role: UserRole }) {
  const definition = roleDefinitions[role];
  const { user } = useAuth();
  const [counts, setCounts] = useState({ primary: 0, secondary: 0, total: 0 });
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    const load = role === "donor" ? listDonationsForUser(user.uid).then(({ donations }) => setCounts({ primary: donations.length, secondary: donations.filter((item) => item.status === "CONFIRMED").length, total: donations.reduce((sum, item) => sum + item.amount, 0) })) : role === "beneficiary" ? listAidRequestsForUser(user.uid).then(({ aidRequests }) => setCounts({ primary: aidRequests.length, secondary: aidRequests.filter((item) => item.status === "APPROVED" || item.status === "PAID").length, total: aidRequests.filter((item) => item.requestedAmount).reduce((sum, item) => sum + (item.requestedAmount || 0), 0) })) : Promise.resolve();
    load.catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger votre activité."));
  }, [role, user]);
  const title = role === "donor" ? "Votre générosité change des vies." : role === "beneficiary" ? "Votre accompagnement, simplement." : "Développons la solidarité ensemble.";
  const body = role === "donor" ? "Suivez vos contributions, découvrez leur impact et soutenez les projets qui vous tiennent à cœur." : role === "beneficiary" ? "Déposez une demande, transmettez vos documents et suivez chaque étape de votre dossier." : "Gérez vos prestations, suivez vos remboursements et restez connecté aux associations.";
  const cards = role === "donor" ? [[`${counts.total.toFixed(2)} €`, "Total donné", "/donor/donations"], [String(counts.primary), "Dons réalisés", "/donor/donations"], [String(counts.secondary), "Dons confirmés", "/donor/impact"]] : role === "beneficiary" ? [[String(counts.primary), "Demandes enregistrées", "/beneficiary/requests"], [String(counts.secondary), "Demandes approuvées", "/beneficiary/requests"], [`${counts.total.toFixed(2)} €`, "Montant demandé", "/beneficiary/requests"]] : [["—", "Prestations réalisées", "/partner/orders"], ["—", "Paiements reçus", "/partner/payments"], ["—", "Associations partenaires", "/partner/orders"]];
  return <div className="dashboard-page"><div className="welcome-banner"><div><p className="eyebrow">{definition.label} · Mon espace</p><h2>{title}</h2><p>{body}</p></div><div className="welcome-shape">{definition.icon}</div></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="dashboard-section-heading"><div><p className="eyebrow">Données Data Connect</p><h2>Votre activité</h2></div><Link className="text-link dark-link" href={`/${role}/profile`}>Gérer mon profil →</Link></div><div className="metric-grid">{cards.map(([value, label, href], index) => <Link className="metric-card" href={href} key={label}><span className={`metric-icon ${index === 0 ? "orange" : index === 1 ? "green" : "navy"}`}>{definition.icon}</span><strong>{value}</strong><span>{label}</span><small>Ouvrir le détail →</small></Link>)}</div><div className="dashboard-columns"><section className="activity-card"><div className="card-heading"><div><p className="eyebrow">Suivi récent</p><h3>Activité de votre espace</h3></div><Link href={`/${role}/notifications`}>Voir tout →</Link></div><div className="activity-row"><span className="activity-dot donation">{definition.icon}</span><div><strong>Vos données sont synchronisées</strong><small>Les informations affichées proviennent de Firebase Data Connect.</small></div><b className="status-text">En ligne</b></div><div className="activity-row"><span className="activity-dot request">✦</span><div><strong>Votre espace est prêt à être complété</strong><small>Ajoutez vos informations pour une meilleure expérience.</small></div><b>→</b></div></section><section className="tip-card"><span className="tip-icon">✦</span><p className="eyebrow">À découvrir</p><h3>Un espace conçu pour vous.</h3><p>Retrouvez les outils essentiels à votre parcours dans les rubriques de votre menu.</p><Link className="text-link" href={`/${role}/profile`}>Compléter mon profil →</Link></section></div></div>;
}
