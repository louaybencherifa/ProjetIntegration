import InternalModule from "@/components/dashboard/internal-module";
import StaffQueue from "@/components/dashboard/staff-queue";

export default function ManagerDonations() {
  return (
    <InternalModule
      role="manager"
      title="Reçus de dons à vérifier"
      description="Consultez les photos de virements et de chèques, puis confirmez ou refusez les dons."
    >
      <StaffQueue kind="donations" />
    </InternalModule>
  );
}
