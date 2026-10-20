"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupplierService, getSupplierContext } from "@/lib/dataconnect/operations";
import { useAuth } from "@/lib/firebase/auth-context";

export default function NewPartnerServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [supplierId, setSupplierId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getSupplierContext(user.uid).then((result) => setSupplierId(result.suppliers[0]?.id || "")).catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger votre profil partenaire."));
  }, [user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supplierId) { setError("Votre profil partenaire doit être créé avant de proposer un service."); return; }
    setPending(true); setError("");
    try {
      await createSupplierService({ supplierId, name, description, category, price: price ? Number(price) : undefined });
      router.push("/partner/orders");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de créer la prestation.");
    } finally {
      setPending(false);
    }
  }

  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Espace partenaire</p><h2>Proposer un service</h2><p>Présentez une prestation aux associations de Solidarité.</p></div></div><form className="request-form request-form-wide" onSubmit={submit}><label>Nom du service<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Paniers alimentaires..." /></label><label>Catégorie<input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Alimentation, santé..." /></label><label>Prix indicatif (€)<input min="0" step="0.01" type="number" value={price} onChange={(event) => setPrice(event.target.value)} /></label><label>Description<textarea required rows={6} value={description} onChange={(event) => setDescription(event.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={pending}>{pending ? "Publication..." : "Publier le service →"}</button></form></section>;
}
