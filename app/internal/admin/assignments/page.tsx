import InternalModule from "@/components/dashboard/internal-module";
import AdminAssignments from "@/components/dashboard/admin-assignments";

export default function AdminAssignmentsPage() {
  return <InternalModule role="super_admin" title="Affectations" description="Affectez les membres du staff et les managers à une association."><AdminAssignments /></InternalModule>;
}
