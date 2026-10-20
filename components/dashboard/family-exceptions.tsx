"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { approveFamilyException, getManagerContext, listFamilyExceptionCandidates } from "@/lib/dataconnect/operations";
import type { FamilyExceptionCandidate } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function FamilyExceptions() {
  const { user } = useAuth();
  const [managerId, setManagerId] = useState("");
  const [requests, setRequests] = useState<FamilyExceptionCandidate[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const result = await listFamilyExceptionCandidates();
      setRequests(result.aidRequests);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de charger les exceptions.");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => {
      Promise.all([getManagerContext(user.uid), load()])
        .then(([context]) => setManagerId(context.associationManagers[0]?.id || ""))
        .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger votre profil manager."));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load, user]);

  async function submit(event: FormEvent<HTMLFormElement>, request: FamilyExceptionCandidate) {
    event.preventDefault();
    const reason = reasons[request.id]?.trim();
    if (!managerId || !reason) {
      setError("Saisissez la raison de l'exception.");
      return;
    }
    try {
      setBusy(request.id);
      setError("");
      await approveFamilyException({ aidRequestId: request.id, managerId, reason });
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d'approuver l'exception.");
    } finally {
      setBusy("");
    }
  }

  return <div className="table-card">{error && <p className="form-error" role="alert">{error}</p>}{requests.length === 0 && !error && <div className="empty-request"><span>✓</span><h3>Aucune exception à traiter</h3><p>Les demandes rejetées ou nécessitant des informations apparaîtront ici.</p></div>}{requests.map((request) => <form className="request-form" key={request.id} onSubmit={(event) => void submit(event, request)}><strong>{request.reference} · {request.beneficiary?.user?.fullName || "Bénéficiaire"}</strong><small>{request.family?.familyId || "Famille"} · {request.status}</small><textarea required value={reasons[request.id] || ""} onChange={(event) => setReasons((current) => ({ ...current, [request.id]: event.target.value }))} placeholder="Motif de l'exception familiale" /><button className="button compact" disabled={busy === request.id || !managerId}>{busy === request.id ? "Validation..." : "Approuver l'exception"}</button></form>)}</div>;
}
