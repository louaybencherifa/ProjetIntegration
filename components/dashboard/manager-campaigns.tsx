"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createCampaign, listActiveAssociations, listManagerCampaigns, updateCampaignStatus } from "@/lib/dataconnect/operations";
import type { CampaignRecord } from "@/lib/dataconnect/types";

const types: CampaignRecord["type"][] = ["RAMADAN", "AID_EL_FITR", "AID_EL_ADHA", "BACK_TO_SCHOOL", "EMERGENCY", "OTHER"];

export default function ManagerCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [associations, setAssociations] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState({ associationId: "", name: "", type: "OTHER" as CampaignRecord["type"], startDate: "", endDate: "", targetAmount: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      setError("");
      const [campaignResult, associationResult] = await Promise.all([listManagerCampaigns(), listActiveAssociations()]);
      setCampaigns(campaignResult.campaigns);
      setAssociations(associationResult.associations);
      setForm((current) => ({ ...current, associationId: current.associationId || associationResult.associations[0]?.id || "" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de charger les campagnes.");
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.associationId || !form.name || !form.startDate) {
      setError("Renseignez l'association, le nom et la date de début.");
      return;
    }
    try {
      setBusy(true);
      setError("");
      await createCampaign({ associationId: form.associationId, name: form.name, type: form.type, startDate: form.startDate, endDate: form.endDate || undefined, targetAmount: form.targetAmount ? Number(form.targetAmount) : undefined });
      setForm((current) => ({ ...current, name: "", startDate: "", endDate: "", targetAmount: "" }));
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La campagne n'a pas pu être créée.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="stacked-content">{error && <p className="form-error" role="alert">{error}</p>}{associations.length === 0 && <p className="form-error" role="alert">Aucune association active n&apos;est disponible. Le super-admin doit activer l&apos;association dans Administration &gt; Associations.</p>}<form className="form-card" onSubmit={submit}><div className="form-grid"><label>Association<select required value={form.associationId} onChange={(event) => setForm({ ...form, associationId: event.target.value })}><option value="">Choisir une association active</option>{associations.map((association) => <option value={association.id} key={association.id}>{association.name}</option>)}</select></label><label>Nom de la campagne<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CampaignRecord["type"] })}>{types.map((type) => <option value={type} key={type}>{type}</option>)}</select></label><label>Début<input required type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label><label>Fin<input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} /></label><label>Objectif (€)<input type="number" min="0" step="0.01" value={form.targetAmount} onChange={(event) => setForm({ ...form, targetAmount: event.target.value })} /></label></div><button className="button" disabled={busy || associations.length === 0}>{busy ? "Création..." : "Créer la campagne"}</button></form><div className="table-card">{campaigns.length === 0 && <div className="empty-request"><span>▤</span><h3>Aucune campagne</h3><p>Créez la première campagne de votre association.</p></div>}{campaigns.map((campaign) => <div className="donation-row" key={campaign.id}><span className="donation-date">▤<br /><small>{campaign.type}</small></span><div><strong>{campaign.name}</strong><small>{campaign.association?.name || "Association"} · {campaign.startDate}</small></div>{campaign.targetAmount ? <b>{campaign.targetAmount.toFixed(2)} €</b> : <b>—</b>}<span className={`pill ${campaign.active ? "confirmed" : "review"}`}>{campaign.active ? "ACTIVE" : "INACTIVE"}</span><button className="button secondary compact" onClick={() => void updateCampaignStatus({ id: campaign.id, active: !campaign.active }).then(load).catch((caught) => setError(caught instanceof Error ? caught.message : "La mise à jour a échoué."))}>{campaign.active ? "Désactiver" : "Activer"}</button></div>)}</div></div>;
}
