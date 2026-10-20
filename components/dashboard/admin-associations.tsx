"use client";

import { useCallback, useEffect, useState } from "react";
import { listAdminAssociations, updateAssociationStatus } from "@/lib/dataconnect/operations";
import type { AdminAssociationRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function AdminAssociationsQueue() {
  const [associations, setAssociations] = useState<AdminAssociationRecord[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const { user } = useAuth();
  const load = useCallback(async () => {
    try {
      setError("");
      setAssociations((await listAdminAssociations()).associations);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de charger les associations.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function changeStatus(id: string, status: AdminAssociationRecord["status"]) {
    try {
      setBusy(id);
      if (!user) throw new Error("Votre session a expiré.");
      await updateAssociationStatus({ id, status, actorId: user.uid });
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La mise à jour a échoué.");
    } finally {
      setBusy("");
    }
  }

  return <div className="table-card">{error && <p className="form-error" role="alert">{error}</p>}{associations.length === 0 && !error && <div className="empty-request"><span>◎</span><h3>Aucune association enregistrée</h3><p>Les demandes d&apos;association apparaîtront ici.</p></div>}{associations.map((association) => <div className="donation-row" key={association.id}><span className="donation-date">◎<br /><small>{association.status}</small></span><div><strong>{association.name}</strong><small>{association.registrationNumber} · {association.region || "Région non renseignée"}</small></div><span className={`pill ${association.status === "ACTIVE" ? "confirmed" : "review"}`}>{association.status}</span>{association.status !== "ACTIVE" && <button className="button compact" disabled={busy === association.id} onClick={() => void changeStatus(association.id, "ACTIVE")}>Activer</button>}{association.status !== "SUSPENDED" && <button className="button secondary compact" disabled={busy === association.id} onClick={() => void changeStatus(association.id, "SUSPENDED")}>Suspendre</button>}</div>)}</div>;
}
