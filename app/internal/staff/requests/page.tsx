import InternalModule from "@/components/dashboard/internal-module";
import StaffQueue from "@/components/dashboard/staff-queue";

export default function StaffRequests() {
  return <InternalModule role="staff" title="Demandes à traiter" description="Analysez les demandes d'aide et leur documentation."><StaffQueue kind="requests" /></InternalModule>;
}
