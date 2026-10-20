"use client";

import { FormEvent, useState } from "react";
import { getCouponByCode, getSupplierContext, redeemCoupon } from "@/lib/dataconnect/operations";
import type { CouponRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function CouponRedemption() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<CouponRecord | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function lookup(event: FormEvent) {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      const result = await getCouponByCode(code.trim());
      setCoupon(result.coupons[0] || null);
      if (!result.coupons[0]) setError("Aucun coupon trouvé avec ce code.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Impossible de rechercher le coupon."); }
  }

  async function redeem() {
    if (!user || !coupon) return;
    try {
      setBusy(true);
      const context = await getSupplierContext(user.uid);
      const supplierId = context.suppliers[0]?.id;
      if (!supplierId) throw new Error("Votre compte partenaire n'est pas configuré.");
      await redeemCoupon({ id: coupon.id, supplierId, redeemedAt: new Date().toISOString(), paymentId: `REM-${coupon.code}-${Date.now()}`, paymentDate: new Date().toISOString().slice(0, 10), amount: coupon.value, notifyUserId: user.uid });
      setCoupon({ ...coupon, status: "USED" });
      setMessage("Coupon marqué comme utilisé.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Le coupon n'a pas pu être utilisé."); } finally { setBusy(false); }
  }

  return <div className="stacked-content"><form className="form-card" onSubmit={lookup}><label>Code du coupon<input required value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="LOT-ABC123" /></label><button className="button">Rechercher</button></form>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success">{message}</p>}{coupon && <div className="table-card"><div className="donation-row"><span className="donation-date">✦<br /><small>{coupon.type}</small></span><div><strong>{coupon.code}</strong><small>{coupon.aidRequest?.reference || "Demande"} · {coupon.family?.familyId || "Famille non affectée"}</small></div><b>{coupon.value.toFixed(2)} €</b><span className={`pill ${coupon.status === "AVAILABLE" ? "confirmed" : "review"}`}>{coupon.status}</span>{coupon.status === "AVAILABLE" && <button className="button compact" disabled={busy} onClick={() => void redeem()}>{busy ? "Validation..." : "Marquer utilisé"}</button>}</div></div>}</div>;
}
