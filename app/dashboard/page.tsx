"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { roleDefinitions } from "@/lib/users/roles";

export default function LegacyDashboardRedirect() {
  const { role, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (!loading && role) router.replace(roleDefinitions[role].home);
    else if (!loading && user) router.replace("/choose-role");
  }, [loading, role, router, user]);

  return <div className="route-loading">Redirection vers votre espace...</div>;
}
