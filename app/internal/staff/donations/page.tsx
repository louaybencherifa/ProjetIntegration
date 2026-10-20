import InternalModule from "@/components/dashboard/internal-module";
import StaffQueue from "@/components/dashboard/staff-queue";

export default function StaffDonations() {
  return <InternalModule role="staff" title="Dons à vérifier" description="Vérifiez les dons en attente et enregistrez leur confirmation."><StaffQueue kind="donations" /></InternalModule>;
}
