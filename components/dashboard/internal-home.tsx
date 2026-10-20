"use client";

import Link from "next/link";
import { roleDefinitions, type UserRole } from "@/lib/users/roles";

export default function InternalHome({ role }: { role: Extract<UserRole, "staff" | "manager" | "super_admin"> }) {
  const definition = roleDefinitions[role];
  const cards = definition.navigation.slice(1).map((item) => ({ ...item, href: item.href }));
  return <section className="inner-page"><div className="welcome-banner"><div><p className="eyebrow">{definition.label} · Espace interne</p><h2>Bienvenue dans votre espace de pilotage.</h2><p>Les outils affichés ici sont réservés à votre rôle et à votre association.</p></div><div className="welcome-shape">{definition.icon}</div></div><div className="dashboard-section-heading"><div><p className="eyebrow">Modules disponibles</p><h2>Gérer la plateforme</h2></div></div><div className="metric-grid">{cards.map((card) => <Link className="metric-card" href={card.href} key={card.href}><span className="metric-icon green">{card.icon}</span><strong>{card.label}</strong><span>Ouvrir le module</span><small>Accéder →</small></Link>)}</div></section>;
}
