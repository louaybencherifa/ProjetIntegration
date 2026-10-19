"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";
import { getUserLabel, logOut } from "@/lib/firebase/auth";
import { useAuth } from "@/lib/firebase/auth-context";
import { roleDefinitions, type UserRole } from "@/lib/users/roles";

export default function RoleShell({ role, children }: PropsWithChildren<{ role: UserRole }>) {
  const { user, role: currentRole, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const definition = roleDefinitions[role];
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (!loading && user && currentRole && currentRole !== role) router.replace(roleDefinitions[currentRole].home);
    else if (!loading && user && !currentRole) router.replace("/choose-role");
  }, [currentRole, loading, role, router, user]);
  if (loading || !user || currentRole !== role) return <div className="route-loading">Chargement de votre espace...</div>;
  return <div className="user-layout"><aside className="user-sidebar"><Link className="brand sidebar-brand" href="/"><span className="brand-mark">{definition.icon}</span><span><strong>Solidarité</strong><small>{definition.label.toUpperCase()}</small></span></Link><p className="sidebar-label">{definition.label}</p><nav>{definition.navigation.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}><span>{link.icon}</span>{link.label}</Link>)}</nav><div className="sidebar-bottom"><Link href={`/${role}/profile`}>⚙ Mon profil</Link><button onClick={() => logOut()}>↪ Se déconnecter</button></div></aside><div className="user-main"><header className="user-header"><div><span className="mobile-label">{definition.label}</span><h1>{pathname.endsWith("/dashboard") ? `Bonjour, ${getUserLabel(user).split(" ")[0]} 👋` : definition.label}</h1></div><Link className="user-avatar" href={`/${role}/profile`}>{getUserLabel(user).slice(0, 1).toUpperCase()}</Link></header><div className="user-content">{children}</div></div></div>;
}
