"use client";

import { useEffect, useState } from "react";
import { listPaymentsForSupplier } from "@/lib/dataconnect/operations";
import type { PaymentRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function PartnerPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    listPaymentsForSupplier(user.uid).then((result) => setPayments(result.payments)).catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos paiements.")).finally(() => setLoading(false));
  }, [user]);
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Espace partenaire</p><h2>Mes paiements</h2><p>Suivez vos remboursements et votre historique financier.</p></div></div><div className="summary-strip"><div><span>Total</span><strong>{total.toFixed(2)} €</strong></div><div><span>Paiements</span><strong>{payments.length}</strong></div><div><span>Payés</span><strong>{payments.filter((payment) => payment.status === "PAID").length}</strong></div></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="table-card"><div className="table-heading"><strong>Historique des paiements</strong><span>{loading ? "Chargement..." : "Data Connect"}</span></div>{!loading && payments.length === 0 && <div className="empty-request"><span>€</span><h3>Aucun paiement enregistré</h3><p>Vos paiements apparaîtront ici.</p></div>}{payments.map((payment) => <div className="donation-row" key={payment.paymentId}><span className="donation-date">€<br /><small>{payment.kind === "SUPPLIER_REIMBURSEMENT" ? "REM" : "AIDE"}</small></span><div><strong>{payment.relatedRef || payment.paymentId}</strong><small>{payment.date} · {payment.kind}</small></div><b>{payment.amount.toFixed(2)} €</b><span className={`pill ${payment.status === "PAID" ? "confirmed" : "review"}`}>{payment.status === "PAID" ? "Payé" : "En attente"}</span></div>)}</div></section>;
}
