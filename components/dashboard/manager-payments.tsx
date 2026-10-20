"use client";

import { useCallback, useEffect, useState } from "react";
import { listPendingPayments, markPaymentPaid } from "@/lib/dataconnect/operations";
import type { PaymentRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function ManagerPayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const { user } = useAuth();
  const load = useCallback(async () => {
    const result = await listPendingPayments();
    setPayments(result.payments);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void load().catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger les remboursements.")); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  async function approve(payment: PaymentRecord) {
    try {
      setBusy(payment.paymentId);
      setError("");
      if (!payment.supplier?.user?.id) throw new Error("Le compte partenaire du remboursement est introuvable.");
      if (!user) throw new Error("Votre session a expiré.");
      await markPaymentPaid({ id: payment.id, notifyUserId: payment.supplier.user.id, actorId: user.uid });
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de valider le remboursement.");
    } finally {
      setBusy("");
    }
  }
  return <div className="table-card">{error && <p className="form-error" role="alert">{error}</p>}{payments.length === 0 && !error && <div className="empty-request"><span>€</span><h3>Aucun remboursement en attente</h3><p>Les remboursements partenaires apparaîtront après utilisation d&apos;un coupon.</p></div>}{payments.map((payment) => <div className="donation-row" key={payment.paymentId}><span className="donation-date">€<br /><small>REM</small></span><div><strong>{payment.supplier?.businessName || "Partenaire"}</strong><small>{payment.relatedRef || payment.paymentId} · {payment.date}</small></div><b>{payment.amount.toFixed(2)} €</b><button className="button compact" disabled={busy === payment.paymentId} onClick={() => void approve(payment)}>{busy === payment.paymentId ? "Validation..." : "Marquer payé"}</button></div>)}</div>;
}
