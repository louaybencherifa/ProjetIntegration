import InternalModule from "@/components/dashboard/internal-module";
import ServiceMarketplace from "@/components/dashboard/service-marketplace";

export default function ManagerServicesPage() {
  return <InternalModule role="manager" title="Prestations partenaires" description="Trouvez un service et envoyez une commande à un fournisseur."><ServiceMarketplace /></InternalModule>;
}
