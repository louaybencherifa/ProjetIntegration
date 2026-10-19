"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";
import { getUserLabel, logOut } from "@/lib/firebase/auth";
import { useAuth } from "@/lib/firebase/auth-context";

const links = [{ href: "/dashboard", label: "Vue d'ensemble", icon: "⌂" }, { href: "/dashboard/donations", label: "Mes dons", icon: "♡" }, { href: "/dashboard/requests", label: "Mes demandes d'aide", icon: "＋" }, { href: "/dashboard/notifications", label: "Notifications", icon: "◌" }, { href: "/dashboard/support", label: "Centre d'aide", icon: "?" }];

export default function UserShell({ children }: PropsWithChildren) {
  const { user, loading } = useAuth(); const router = useRouter(); const pathname = usePathname();
  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <div className="route-loading">Chargement de votre espace...</div>;
  return <div className="user-layout"><aside className="user-sidebar"><Link className="brand sidebar-brand" href="/"><span className="brand-mark">♡</span><span><strong>Solidarité</strong><small>ENSEMBLE</small></span></Link><p className="sidebar-label">Mon espace</p><nav>{links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}><span>{link.icon}</span>{link.label}</Link>)}</nav><div className="sidebar-bottom"><Link href="/dashboard/profile">⚙ Mon profil</Link><button onClick={() => logOut()}>↪ Se déconnecter</button></div></aside><div className="user-main"><header className="user-header"><div><span className="mobile-label">Mon espace</span><h1>{pathname === "/dashboard" ? `Bonjour, ${getUserLabel(user).split(" ")[0]} 👋` : "Mon espace"}</h1></div><Link className="user-avatar" href="/dashboard/profile">{getUserLabel(user).slice(0, 1).toUpperCase()}</Link></header><div className="user-content">{children}</div></div></div>;
}
