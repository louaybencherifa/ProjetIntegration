import InternalModule from "@/components/dashboard/internal-module";
import ManagerCampaigns from "@/components/dashboard/manager-campaigns";

export default function ManagerCampaignsPage() {
  return <InternalModule role="manager" title="Campagnes" description="Organisez les campagnes de collecte et suivez leurs objectifs."><ManagerCampaigns /></InternalModule>;
}
