"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { assignStaffToAssociation, getManagerAssignment, getStaffAssignment, listAdminAssignmentData, promoteStaffToManager } from "@/lib/dataconnect/operations";
import type { DataConnectUser } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function AdminAssignments() {
  const [users, setUsers] = useState<DataConnectUser[]>([]);
  const [associations, setAssociations] = useState<Array<{ id: string; name: string }>>([]);
  const [userId, setUserId] = useState("");
  const [associationId, setAssociationId] = useState("");
  const [department, setDepartment] = useState<"SUPPORT" | "REQUESTS" | "ACCOUNTING">("SUPPORT");
  const [position, setPosition] = useState("");
  const [manager, setManager] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { user: actor } = useAuth();

  const load = useCallback(async () => {
    const result = await listAdminAssignmentData();
    setUsers(result.users);
    setAssociations(result.associations);
    setUserId((current) => current || result.users[0]?.id || "");
    setAssociationId((current) => current || result.associations[0]?.id || "");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load().catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger les affectations.")); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId || !associationId) {
      setError("Sélectionnez un utilisateur et une association.");
      return;
    }
    try {
      setBusy(true);
      setError("");
      const existingStaff = (await getStaffAssignment(userId)).associationStaffs[0];
      const staffId = existingStaff?.id || crypto.randomUUID();
      await assignStaffToAssociation({ staffId, userId, associationId, department, position: position || undefined });
      if (manager) {
        if (!actor) throw new Error("Votre session a expiré.");
        const existingManager = (await getManagerAssignment(staffId)).associationManagers[0];
        if (!existingManager) {
          await promoteStaffToManager({ managerId: crypto.randomUUID(), staffId, actorId: actor.uid });
        }
      }
      setMessage("L’affectation a été enregistrée.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d’enregistrer l’affectation.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="request-form request-form-wide" onSubmit={submit}><label>Utilisateur<select value={userId} onChange={(event) => setUserId(event.target.value)}>{users.map((user) => <option value={user.id} key={user.id}>{user.fullName} · {user.role}</option>)}</select></label><label>Association<select value={associationId} onChange={(event) => setAssociationId(event.target.value)}>{associations.map((association) => <option value={association.id} key={association.id}>{association.name}</option>)}</select></label><label>Département<select value={department} onChange={(event) => setDepartment(event.target.value as typeof department)}><option value="SUPPORT">Support</option><option value="REQUESTS">Demandes</option><option value="ACCOUNTING">Comptabilité</option></select></label><label>Poste<input value={position} onChange={(event) => setPosition(event.target.value)} placeholder="Agent de suivi" /></label><label className="checkbox-label"><input type="checkbox" checked={manager} onChange={(event) => setManager(event.target.checked)} /> Promouvoir comme manager</label>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}<button className="button" disabled={busy}>{busy ? "Enregistrement..." : "Enregistrer l’affectation →"}</button></form>;
}
