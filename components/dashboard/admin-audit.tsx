"use client";

import { useCallback, useEffect, useState } from "react";
import { listAuditLogs } from "@/lib/dataconnect/operations";
import type { AuditLogRecord } from "@/lib/dataconnect/types";

export default function AdminAuditList() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [error, setError] = useState("");
  const load = useCallback(async () => { try { setLogs((await listAuditLogs()).auditLogs); } catch (caught) { setError(caught instanceof Error ? caught.message : "Impossible de charger le journal."); } }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  return <div className="table-card">{error && <p className="form-error" role="alert">{error}</p>}{logs.length === 0 && !error && <div className="empty-request"><span>✓</span><h3>Aucune action enregistrée</h3><p>Les événements d&apos;audit apparaîtront ici.</p></div>}{logs.map((log) => <div className="donation-row" key={log.id}><span className="donation-date">⌁<br /><small>{log.performedAt}</small></span><div><strong>{log.action}</strong><small>{log.user?.fullName || "Système"} · {log.targetRef || "—"}</small></div><span>{log.details || "Action enregistrée"}</span></div>)}</div>;
}
