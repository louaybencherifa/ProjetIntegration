import InternalModule from "@/components/dashboard/internal-module";
import { ReportList } from "@/components/dashboard/manager-data";

export default function ManagerReports() {
  return <InternalModule role="manager" title="Rapports" description="Consultez les indicateurs de distribution et de traitement."><ReportList /></InternalModule>;
}
