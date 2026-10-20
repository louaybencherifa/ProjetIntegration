import InternalModule from "@/components/dashboard/internal-module";
import ManagerPayments from "@/components/dashboard/manager-payments";

export default function ManagerPaymentsPage() {
  return <InternalModule role="manager" title="Remboursements partenaires" description="Validez les remboursements internes après vérification des coupons utilisés."><ManagerPayments /></InternalModule>;
}
