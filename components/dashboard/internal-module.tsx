import Link from "next/link";
import { roleDefinitions, type UserRole } from "@/lib/users/roles";

export default function InternalModule({ role, title, description, children }: { role: Extract<UserRole, "staff" | "manager" | "super_admin">; title: string; description: string; children?: React.ReactNode }) {
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">{role === "staff" ? "Staff" : role === "manager" ? "Manager" : "Super Admin"} · Espace interne</p><h2>{title}</h2><p>{description}</p></div></div>{children || <div className="empty-request"><span>✦</span><h3>Module connecté à votre espace sécurisé</h3><p>Les opérations de ce module seront limitées aux données de votre association et à votre rôle.</p><Link className="text-link dark-link" href={roleDefinitions[role].home}>Retour à l&apos;accueil interne →</Link></div>}</section>;
}
