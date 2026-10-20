import InternalModule from "@/components/dashboard/internal-module";
import AdminUsersQueue from "@/components/dashboard/admin-users";

export default function AdminUsers() {
  return <InternalModule role="super_admin" title="Utilisateurs" description="Supervisez les rôles et les accès des utilisateurs."><AdminUsersQueue /></InternalModule>;
}
