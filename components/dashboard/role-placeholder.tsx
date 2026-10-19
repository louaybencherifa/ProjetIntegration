import Link from "next/link";
import type { UserRole } from "@/lib/users/roles";

export default function RolePlaceholder({ role, title, description }: { role: UserRole; title: string; description: string }) {
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">{role === "donor" ? "Donateur" : role === "beneficiary" ? "Bénéficiaire" : "Partenaire"}</p><h2>{title}</h2><p>{description}</p></div></div><div className="empty-request role-coming-soon"><span>✦</span><h3>Votre espace évolue avec vous.</h3><p>Cette fonctionnalité est prête à être développée dans son module dédié.</p><Link className="text-link dark-link" href={`/${role}/dashboard`}>Retour à mon tableau de bord →</Link></div></section>;
}
