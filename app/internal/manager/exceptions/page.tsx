import InternalModule from "@/components/dashboard/internal-module";
import FamilyExceptions from "@/components/dashboard/family-exceptions";

export default function ManagerExceptions() {
  return <InternalModule role="manager" title="Exceptions familiales" description="Examinez les demandes nécessitant une dérogation et justifiez votre décision."><FamilyExceptions /></InternalModule>;
}
