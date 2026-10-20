import InternalModule from "@/components/dashboard/internal-module";
import AdminAuditList from "@/components/dashboard/admin-audit";

export default function AdminAudit() {
  return <InternalModule role="super_admin" title="Journal d'audit" description="Consultez les actions importantes effectuées sur la plateforme."><AdminAuditList /></InternalModule>;
}
