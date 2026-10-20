"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createServiceOrder, getManagerContext, listActiveSupplierServices } from "@/lib/dataconnect/operations";
import type { SupplierServiceRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function ServiceMarketplace() {
  const { user } = useAuth();
  const [services, setServices] = useState<SupplierServiceRecord[]>([]);
  const [associationId, setAssociationId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [selectedService, setSelectedService] = useState<SupplierServiceRecord | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [reference, setReference] = useState("");
  const load = useCallback(async () => {
    try {
      const serviceResult = await listActiveSupplierServices();
      setServices(serviceResult.supplierServices);
      if (user) {
        const context = await getManagerContext(user.uid);
        setAssociationId(context.associationManagers[0]?.staff?.association?.id || "");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de charger les prestations.");
    }
  }, [user]);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  function openOrder(service: SupplierServiceRecord) {
    setError("");
    setMessage("");
    setSelectedService(service);
    setQuantity("1");
    setReference("");
  }
  async function order(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const service = selectedService;
    if (!service) {
      setError("Sélectionnez une prestation.");
      return;
    }
    if (!user || !associationId || !service.supplier?.id) {
      setError("Votre compte n'est pas encore rattaché à une association.");
      return;
    }
    const parsedQuantity = Number(quantity);
    if (!reference.trim() || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("Renseignez une référence et une quantité valide.");
      return;
    }
    try {
      setBusy(service.id);
      await createServiceOrder({ reference: reference.trim(), serviceId: service.id, supplierId: service.supplier.id, associationId, requestedBy: user.uid, quantity: parsedQuantity, totalAmount: service.price ? service.price * parsedQuantity : undefined });
      setError("");
      setSelectedService(null);
      setMessage("La commande a été envoyée au partenaire.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La commande n'a pas pu être créée.");
    } finally { setBusy(""); }
  }
  return <div className="table-card">{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}{services.length === 0 && !error && <div className="empty-request"><span>▤</span><h3>Aucune prestation active</h3><p>Les services des partenaires apparaîtront ici.</p></div>}{services.map((service) => <div className="donation-row" key={service.id}><span className="donation-date">◆<br /><small>{service.category || "Service"}</small></span><div><strong>{service.name}</strong><small>{service.supplier?.businessName || "Partenaire"} · {service.description || "—"}</small></div><b>{service.price ? `${service.price.toFixed(2)} €` : "Sur devis"}</b><button className="button compact" disabled={Boolean(busy)} onClick={() => openOrder(service)}>{busy === service.id ? "Envoi..." : "Commander"}</button></div>)}{selectedService && <form className="request-form request-form-wide" onSubmit={(event) => void order(event)}><h3>Commander : {selectedService.name}</h3><label>Référence de commande<input required value={reference} onChange={(event) => setReference(event.target.value)} /></label><label>Quantité<input required min="1" step="1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><p>{selectedService.price ? `Total indicatif : ${(selectedService.price * (Number(quantity) || 0)).toFixed(2)} €` : "Montant sur devis"}</p><div><button className="button" disabled={busy === selectedService.id}>{busy === selectedService.id ? "Envoi..." : "Confirmer la commande"}</button><button type="button" className="button secondary" onClick={() => setSelectedService(null)}>Annuler</button></div></form>}</div>;
}
