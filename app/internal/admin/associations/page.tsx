import InternalModule from "@/components/dashboard/internal-module";
import AdminAssociationsQueue from "@/components/dashboard/admin-associations";

export default function AdminAssociations() {
  return <InternalModule role="super_admin" title="Associations" description="Validez, suspendez et gérez les associations de la plateforme."><AdminAssociationsQueue /></InternalModule>;
}
