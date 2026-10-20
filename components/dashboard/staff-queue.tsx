"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listPendingDonations,
  listAvailableCouponsForAssignment,
  listCouponsForFamily,
  assignCouponToAidRequest,
  listFamilyExceptionsForRequest,
  listStaffAidRequests,
  listSupportTickets,
  markDonationVerified,
  reviewAidRequest,
  updateSupportTicketStatus,
} from "@/lib/dataconnect/operations";
import type { DonationRecord, StaffAidRequestRecord, StaffSupportTicketRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

type QueueKind = "donations" | "requests" | "support";

export default function StaffQueue({ kind }: { kind: QueueKind }) {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [requests, setRequests] = useState<StaffAidRequestRecord[]>([]);
  const [tickets, setTickets] = useState<StaffSupportTicketRecord[]>([]);
  const [coupons, setCoupons] = useState<import("@/lib/dataconnect/types").CouponRecord[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<Record<string, string>>({});
  const [familyEligibility, setFamilyEligibility] = useState<Record<string, { hasUsedCoupon: boolean; hasException: boolean }>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      if (kind === "donations") setDonations((await listPendingDonations()).donations);
      if (kind === "requests") {
        const [requestResult, couponResult] = await Promise.all([listStaffAidRequests(), listAvailableCouponsForAssignment()]);
        setRequests(requestResult.aidRequests);
        setCoupons(couponResult.coupons);
        const eligibility = await Promise.all(requestResult.aidRequests.map(async (request) => {
          if (!request.family?.id) return [request.id, { hasUsedCoupon: false, hasException: false }] as const;
          if (!user) return [request.id, { hasUsedCoupon: false, hasException: false }] as const;
          const [familyCoupons, exceptions] = await Promise.all([
            listCouponsForFamily(request.family.id, user.uid),
            listFamilyExceptionsForRequest(request.id, user.uid),
          ]);
          return [request.id, {
            hasUsedCoupon: familyCoupons.coupons.length > 0,
            hasException: exceptions.familyExceptions.length > 0,
          }] as const;
        }));
        setFamilyEligibility(Object.fromEntries(eligibility));
      }
      if (kind === "support") setTickets((await listSupportTickets()).supportTickets);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de charger le module.");
    }
  }, [kind, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function update(id: string, action: () => Promise<unknown>) {
    try {
      setBusy(id);
      setError("");
      await action();
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La mise à jour a échoué.");
    } finally {
      setBusy("");
    }
  }

  return <div className="table-card">
    {error && <p className="form-error" role="alert">{error}</p>}
    {kind === "donations" && <>{donations.length === 0 && <Empty text="Aucun don en attente." />}{donations.map((donation) => <div className="donation-row" key={donation.id || donation.reference}><span className="donation-date">€<br /><small>{donation.method}</small></span><div><strong>{donation.donorName}</strong><small>{donation.reference} · {donation.association?.name || "Association"}</small>{donation.receiptImage ? <a className="text-link dark-link" href={donation.receiptImage} target="_blank" rel="noreferrer">Voir le reçu</a> : <small>Aucun reçu joint</small>}</div><b>{donation.amount.toFixed(2)} €</b><button className="button compact" disabled={!donation.id || busy === donation.id || !donation.donor?.user?.id} onClick={() => donation.id && donation.donor?.user?.id && void update(donation.id, () => markDonationVerified({ id: donation.id as string, status: "CONFIRMED", notifyUserId: donation.donor?.user?.id || "", notificationMessage: `Votre don ${donation.reference} a été confirmé.` }))}>Confirmer</button><button className="button secondary compact" disabled={!donation.id || busy === donation.id || !donation.donor?.user?.id} onClick={() => donation.id && donation.donor?.user?.id && void update(donation.id, () => markDonationVerified({ id: donation.id as string, status: "REFUSED", notifyUserId: donation.donor?.user?.id || "", notificationMessage: `Votre don ${donation.reference} a été refusé après vérification.` }))}>Refuser</button></div>)}</>}
    {kind === "requests" && <>{requests.length === 0 && <Empty text="Aucune demande à traiter." />}{requests.map((request) => {
      const eligibility = familyEligibility[request.id];
      const familyBlocked = Boolean(eligibility?.hasUsedCoupon && !eligibility.hasException);
      return <div className="donation-row" key={request.id}><span className="donation-date">✦<br /><small>{request.type}</small></span><div><strong>{request.reference}</strong><small>{request.beneficiary?.user?.fullName || "Bénéficiaire"} · {request.family?.familyId || "Famille"}</small>{request.status === "APPROVED" && request.family && (familyBlocked ? <small>Cette famille a déjà utilisé ou reçu un coupon. Une exception manager est requise.</small> : <select aria-label={`Coupon pour ${request.reference}`} value={selectedCoupons[request.id] || ""} onChange={(event) => setSelectedCoupons((current) => ({ ...current, [request.id]: event.target.value }))}><option value="">Attribuer un coupon</option>{coupons.filter((coupon) => coupon.type === request.type).map((coupon) => <option value={coupon.id} key={coupon.id}>{coupon.code} · {coupon.value.toFixed(2)} €</option>)}</select>)}{request.status === "APPROVED" && request.family && !familyBlocked && selectedCoupons[request.id] && <button className="button compact" disabled={busy === request.id} onClick={() => void update(request.id, () => assignCouponToAidRequest({ couponId: selectedCoupons[request.id], familyId: request.family?.id || "", aidRequestId: request.id, notifyUserId: request.beneficiary?.user?.id || "", notificationMessage: `Un coupon a été attribué à votre demande ${request.reference}.` }))}>Attribuer</button>}</div><span className={`pill ${request.status === "APPROVED" ? "confirmed" : "review"}`}>{request.status}</span><button className="button compact" disabled={busy === request.id || !request.beneficiary?.user?.id} onClick={() => request.beneficiary?.user?.id && void update(request.id, () => reviewAidRequest({ id: request.id, status: "APPROVED", notifyUserId: request.beneficiary?.user?.id || "", notificationMessage: `Votre demande ${request.reference} a été approuvée.` }))}>Approuver</button><button className="button secondary compact" disabled={busy === request.id || !request.beneficiary?.user?.id} onClick={() => request.beneficiary?.user?.id && void update(request.id, () => reviewAidRequest({ id: request.id, status: "REJECTED", notifyUserId: request.beneficiary?.user?.id || "", notificationMessage: `Votre demande ${request.reference} a été refusée.` }))}>Refuser</button></div>;
    })}</>}
    {kind === "support" && <>{tickets.length === 0 && <Empty text="Aucun ticket ouvert." />}{tickets.map((ticket) => <div className="donation-row" key={ticket.id}><span className="donation-date">?</span><div><strong>{ticket.subject}</strong><small>{ticket.user?.fullName || "Utilisateur"} · {ticket.message}</small></div><span className="pill review">{ticket.status}</span><button className="button compact" disabled={busy === ticket.id} onClick={() => void update(ticket.id, () => updateSupportTicketStatus({ id: ticket.id, status: "CLOSED" }))}>Clôturer</button></div>)}</>}
  </div>;
}

function Empty({ text }: { text: string }) {
  return <div className="empty-request"><span>✓</span><h3>{text}</h3><p>Les nouvelles données apparaîtront automatiquement ici.</p></div>;
}
