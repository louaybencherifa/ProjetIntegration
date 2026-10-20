import InternalModule from "@/components/dashboard/internal-module";
import StaffQueue from "@/components/dashboard/staff-queue";
import StaffConversations from "@/components/dashboard/staff-conversations";

export default function StaffSupport() {
  return <InternalModule role="staff" title="Support" description="Répondez aux tickets et accompagnez les utilisateurs."><StaffQueue kind="support" /><div className="dashboard-section-heading"><div><p className="eyebrow">Messagerie</p><h2>Conversations</h2></div></div><StaffConversations /></InternalModule>;
}
