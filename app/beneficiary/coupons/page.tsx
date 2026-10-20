"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { listCouponsForBeneficiary } from "@/lib/dataconnect/operations";
import type { CouponRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function BeneficiaryCouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    listCouponsForBeneficiary(user.uid)
      .then((result) => setCoupons(result.coupons))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos coupons."));
  }, [user]);

  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Espace bénéficiaire</p><h2>Mes coupons</h2><p>Présentez le QR code au partenaire. Un coupon utilisé devient définitivement invalide.</p></div></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="table-card">{coupons.length === 0 && !error && <div className="empty-request"><span>✦</span><h3>Aucun coupon attribué</h3><p>Les coupons apparaîtront ici après validation et attribution par l&apos;équipe.</p></div>}{coupons.map((coupon) => <div className="donation-row" key={coupon.id}><span className="donation-date">✦<br /><small>{coupon.type}</small></span><div><strong>{coupon.code}</strong><small>{coupon.aidRequest?.reference || "Demande"} · {coupon.value.toFixed(2)} €{coupon.expiresAt ? ` · Expire le ${coupon.expiresAt}` : ""}</small><CouponQr code={coupon.code} /></div><span className={`pill ${coupon.status === "USED" ? "confirmed" : "review"}`}>{coupon.status === "USED" ? "UTILISÉ / INVALIDE" : coupon.status}</span></div>)}</div></section>;
}

function CouponQr({ code }: { code: string }) {
  const [dataUrl, setDataUrl] = useState("");
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(code, { width: 160, margin: 1 })
      .then((url) => { if (active) setDataUrl(url); })
      .catch(() => { if (active) setDataUrl(""); });
    return () => { active = false; };
  }, [code]);
  return dataUrl ? <Image src={dataUrl} alt={`QR code du coupon ${code}`} width={160} height={160} unoptimized /> : <small>QR code en préparation…</small>;
}
