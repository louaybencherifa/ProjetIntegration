import type { PropsWithChildren } from "react";
import RoleShell from "@/components/dashboard/role-shell";

export const instant = false;

export default function ManagerLayout({ children }: PropsWithChildren) {
  return <RoleShell role="manager">{children}</RoleShell>;
}
