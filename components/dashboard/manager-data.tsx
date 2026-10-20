"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createCoupon, createCouponBatch, createManagerReport, getManagerContext, getManagerReportMetrics, listCouponBatches, listCouponsForBatch, listManagerCampaigns, listManagerReports, listExpiredCoupons, markCouponExpired } from "@/lib/dataconnect/operations";
import { useAuth } from "@/lib/firebase/auth-context";
import type { CouponBatchRecord, ReportRecord } from "@/lib/dataconnect/types";

export function CouponBatchList() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<CouponBatchRecord[]>([]);
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([]);
  const [managerId, setManagerId] = useState("");
  const [form, setForm] = useState({ campaignId: "", couponType: "FOOD_COUPON" as CouponBatchRecord["couponType"], couponCount: "1", valueEach: "0", expiryDate: "", description: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState("");
  const [expiring, setExpiring] = useState(false);
  const load = useCallback(async () => {
    try {
      const [batchResult, campaignResult] = await Promise.all([listCouponBatches(), listManagerCampaigns()]);
      setBatches(batchResult.couponBatches);
      setCampaigns(campaignResult.campaigns.filter((campaign) => campaign.active).map((campaign) => ({ id: campaign.id, name: campaign.name })));
      if (user) {
        const managerResult = await getManagerContext(user.uid);
        setManagerId(managerResult.associationManagers[0]?.id || "");
        if (!managerResult.associationManagers[0]) {
          setError("Votre compte n'est pas encore affecté comme manager à une association. Un super-admin doit vous affecter depuis Administration > Affectations.");
        } else if (campaignResult.campaigns.filter((campaign) => campaign.active).length === 0) {
          setError("Aucune campagne active n'est disponible. Créez une campagne dans Manager > Campagnes après activation de votre association.");
        }
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Impossible de charger les lots."); }
  }, [user]);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const count = Number(form.couponCount);
    const value = Number(form.valueEach);
    if (!managerId || !form.campaignId || !Number.isInteger(count) || count < 1 || value <= 0) { setError("Sélectionnez une campagne et renseignez une quantité et une valeur valides."); return; }
    try {
      setBusy(true);
      setError("");
      await createCouponBatch({ batchId: `LOT-${Date.now()}`, managerId, campaignId: form.campaignId, couponType: form.couponType, couponCount: count, valueEach: value, totalReserved: count * value, expiryDate: form.expiryDate || undefined, description: form.description || undefined });
      setForm((current) => ({ ...current, couponCount: "1", valueEach: "0", expiryDate: "", description: "" }));
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Le lot n'a pas pu être créé."); } finally { setBusy(false); }
  }
  async function generateCoupons(batch: CouponBatchRecord) {
    try {
      setGenerating(batch.id);
      setError("");
      const existing = await listCouponsForBatch(batch.id);
      const missing = Math.max(0, batch.couponCount - existing.coupons.length);
      if (missing === 0) {
        setError("Tous les coupons de ce lot sont déjà générés.");
        return;
      }
      for (let index = 0; index < missing; index += 1) {
        const number = existing.coupons.length + index + 1;
        await createCoupon({
          reference: `${batch.batchId}-${number}`,
          code: `${batch.batchId}-${number}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
          batchId: batch.id,
          type: batch.couponType,
          value: batch.valueEach,
          expiresAt: batch.expiryDate || undefined,
        });
      }
      setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Les coupons n'ont pas pu être générés."); } finally { setGenerating(""); }
  }
  async function expireCoupons() {
    try {
      setExpiring(true);
      setError("");
      const result = await listExpiredCoupons(new Date().toISOString().slice(0, 10));
      await Promise.all(result.coupons.map((coupon) => markCouponExpired(coupon.id)));
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Les coupons expirés n'ont pas pu être actualisés.");
    } finally {
      setExpiring(false);
    }
  }
  return <div className="stacked-content"><form className="form-card" onSubmit={submit}><div className="form-grid"><label>Campagne<select required value={form.campaignId} onChange={(event) => setForm({ ...form, campaignId: event.target.value })}><option value="">Choisir une campagne active</option>{campaigns.map((campaign) => <option value={campaign.id} key={campaign.id}>{campaign.name}</option>)}</select></label><label>Type d&apos;aide<select value={form.couponType} onChange={(event) => setForm({ ...form, couponType: event.target.value as CouponBatchRecord["couponType"] })}><option value="FOOD_COUPON">Alimentation</option><option value="MEDICAL">Médical</option><option value="HOUSING">Logement</option><option value="SCHOOL">Scolaire</option><option value="EMERGENCY">Urgence</option></select></label><label>Nombre de coupons<input type="number" min="1" max="100" value={form.couponCount} onChange={(event) => setForm({ ...form, couponCount: event.target.value })} /></label><label>Valeur unitaire (€)<input type="number" min="0.01" step="0.01" value={form.valueEach} onChange={(event) => setForm({ ...form, valueEach: event.target.value })} /></label><label>Date d&apos;expiration<input type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} /></label><label>Description<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label></div><button className="button" disabled={busy || !managerId || campaigns.length === 0}>{busy ? "Création..." : "Créer le lot"}</button></form>{error && <p className="form-error" role="alert">{error}</p>}<button className="button secondary" disabled={expiring} onClick={() => void expireCoupons()}>{expiring ? "Vérification..." : "Marquer les coupons expirés"}</button><div className="table-card">{batches.length === 0 && !error && <Empty text="Aucun lot de coupons enregistré." />}{batches.map((batch) => <div className="donation-row" key={batch.id}><span className="donation-date">▣<br /><small>{batch.couponType}</small></span><div><strong>{batch.batchId}</strong><small>{batch.campaign?.name || "Campagne"} · {batch.couponCount} coupons</small></div><b>{batch.totalReserved.toFixed(2)} €</b><span className="pill review">{batch.expiryDate || "Sans échéance"}</span><button className="button compact" disabled={Boolean(generating)} onClick={() => void generateCoupons(batch)}>{generating === batch.id ? "Génération..." : "Générer les coupons"}</button></div>)}</div></div>;
}

export function ReportList() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [manager, setManager] = useState<{ id: string; associationId: string } | null>(null);
  const [form, setForm] = useState({ period: "", distributionRate: "", avgProcessingDays: "", couponsUsedRate: "" });
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setReports((await listManagerReports()).reports);
      if (user) {
        const context = (await getManagerContext(user.uid)).associationManagers[0];
        setManager(context?.staff?.association && context ? { id: context.id, associationId: context.staff.association.id } : null);
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Impossible de charger les rapports."); }
  }, [user]);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!manager || !form.period) { setError("Renseignez une période et vérifiez le rattachement du manager."); return; }
    try {
      await createManagerReport({ associationId: manager.associationId, managerId: manager.id, period: form.period, distributionRate: form.distributionRate ? Number(form.distributionRate) : undefined, avgProcessingDays: form.avgProcessingDays ? Number(form.avgProcessingDays) : undefined, couponsUsedRate: form.couponsUsedRate ? Number(form.couponsUsedRate) : undefined });
      setForm({ period: "", distributionRate: "", avgProcessingDays: "", couponsUsedRate: "" });
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Le rapport n'a pas pu être créé."); }
  }
  async function calculateMetrics() {
    if (!manager) return;
    try {
      setCalculating(true);
      const metrics = await getManagerReportMetrics(manager.associationId);
      const confirmed = metrics.donations.filter((donation) => donation.status === "CONFIRMED").length;
      const processingDays = metrics.aidRequests.filter((request) => request.status !== "PENDING").map((request) => Math.max(0, (Date.now() - new Date(request.submittedAt).getTime()) / 86400000));
      const used = metrics.coupons.filter((coupon) => coupon.status === "USED").length;
      setForm((current) => ({ ...current, distributionRate: metrics.donations.length ? ((confirmed / metrics.donations.length) * 100).toFixed(1) : "0", avgProcessingDays: processingDays.length ? (processingDays.reduce((sum, days) => sum + days, 0) / processingDays.length).toFixed(1) : "0", couponsUsedRate: metrics.coupons.length ? ((used / metrics.coupons.length) * 100).toFixed(1) : "0" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Les indicateurs n'ont pas pu être calculés.");
    } finally {
      setCalculating(false);
    }
  }
  return <div className="stacked-content"><form className="form-card" onSubmit={submit}><div className="form-grid"><label>Période<input required placeholder="2026-10" value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })} /></label><label>Taux de distribution (%)<input type="number" min="0" max="100" step="0.1" value={form.distributionRate} onChange={(event) => setForm({ ...form, distributionRate: event.target.value })} /></label><label>Délai moyen (jours)<input type="number" min="0" step="0.1" value={form.avgProcessingDays} onChange={(event) => setForm({ ...form, avgProcessingDays: event.target.value })} /></label><label>Taux coupons utilisés (%)<input type="number" min="0" max="100" step="0.1" value={form.couponsUsedRate} onChange={(event) => setForm({ ...form, couponsUsedRate: event.target.value })} /></label></div><button type="button" className="button secondary" disabled={!manager || calculating} onClick={() => void calculateMetrics()}>{calculating ? "Calcul..." : "Calculer depuis les données"}</button><button className="button" disabled={!manager}>Générer le rapport</button></form><div className="table-card">{error && <p className="form-error" role="alert">{error}</p>}{reports.length === 0 && !error && <Empty text="Aucun rapport généré." />}{reports.map((report) => <div className="donation-row" key={report.id}><span className="donation-date">▤<br /><small>{report.period}</small></span><div><strong>{report.association?.name || "Association"}</strong><small>Généré le {report.generatedAt}</small></div><b>{report.distributionRate?.toFixed(1) || "—"}%</b><span className="pill confirmed">Rapport</span></div>)}</div></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="empty-request"><span>✓</span><h3>{text}</h3><p>Les nouvelles données apparaîtront ici.</p></div>;
}
