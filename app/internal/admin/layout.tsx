import type { PropsWithChildren } from "react";
import RoleShell from "@/components/dashboard/role-shell";

export const instant = false;

export default function AdminLayout({ children }: PropsWithChildren) {
  return <RoleShell role="super_admin">{children}</RoleShell>;
}
