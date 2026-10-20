import type { PropsWithChildren } from "react";
import RoleShell from "@/components/dashboard/role-shell";

export const instant = false;

export default function StaffLayout({ children }: PropsWithChildren) {
  return <RoleShell role="staff">{children}</RoleShell>;
}
