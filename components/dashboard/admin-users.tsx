"use client";

import { useCallback, useEffect, useState } from "react";
import { createAuditLog, listUsersForAdmin, updateUserActiveStatus, updateUserRole } from "@/lib/dataconnect/operations";
import type { DataConnectRole, DataConnectUser } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function AdminUsersQueue() {
  const { user: actor } = useAuth();
  const [users, setUsers] = useState<DataConnectUser[]>([]);
  const [error, setError] = useState("");
  const load = useCallback(async () => { try { setUsers((await listUsersForAdmin()).users); } catch (caught) { setError(caught instanceof Error ? caught.message : "Impossible de charger les utilisateurs."); } }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  async function toggle(user: DataConnectUser) { try { if (!actor) throw new Error("Votre session a expiré."); await updateUserActiveStatus({ id: user.id, active: !user.active, actorId: actor.uid }); await createAuditLog({ userId: actor.uid, action: user.active ? "USER_DEACTIVATED" : "USER_ACTIVATED", targetRef: user.id, details: user.email }); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "La mise à jour a échoué."); } }
  async function changeRole(user: DataConnectUser, role: DataConnectRole) { try { if (!actor) throw new Error("Votre session a expiré."); await updateUserRole({ id: user.id, role, actorId: actor.uid }); await createAuditLog({ userId: actor.uid, action: "USER_ROLE_CHANGED", targetRef: user.id, details: `${user.role} -> ${role}` }); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Le rôle n'a pas pu être modifié."); } }
  return <div className="table-card">{error && <p className="form-error" role="alert">{error}</p>}{users.map((user) => <div className="donation-row" key={user.id}><span className="donation-date">◎<br /><small>{user.role}</small></span><div><strong>{user.fullName}</strong><small>{user.email}</small></div><select aria-label={`Rôle de ${user.fullName}`} value={user.role} onChange={(event) => void changeRole(user, event.target.value as DataConnectRole)}><option value="DONOR">Donateur</option><option value="BENEFICIARY">Bénéficiaire</option><option value="SUPPLIER">Partenaire</option><option value="STAFF">Staff</option><option value="MANAGER">Manager</option><option value="SUPER_ADMIN">Super admin</option></select><span className={`pill ${user.active ? "confirmed" : "review"}`}>{user.active ? "ACTIF" : "BLOQUÉ"}</span><button className="button secondary compact" onClick={() => void toggle(user)}>{user.active ? "Désactiver" : "Activer"}</button></div>)}</div>;
}
