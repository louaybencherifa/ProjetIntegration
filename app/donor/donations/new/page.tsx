"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createDonation, getDonorContext, listDonationAssociations } from "@/lib/dataconnect/operations";
import type { DonationMethod } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";
import { storage } from "@/lib/firebase/storage";

export default function NewDonationPage() {
  const { user } = useAuth();
  const [donorId, setDonorId] = useState("");
  const [associations, setAssociations] = useState<Array<{ id: string; name: string }>>([]);
  const [associationId, setAssociationId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<DonationMethod>("BANK_TRANSFER");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function selectReceipt(event: ChangeEvent<HTMLInputElement>) {
    setReceipt(event.target.files?.[0] || null);
  }

  useEffect(() => {
    if (!user) return;
    Promise.all([getDonorContext(user.uid), listDonationAssociations()])
      .then(([context, associationResult]) => {
        setDonorId(context.donors[0]?.id || "");
        setAssociations(associationResult.associations);
        setAssociationId(associationResult.associations[0]?.id || "");
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de préparer votre don."))
      .finally(() => setLoading(false));
  }, [user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !donorId || !associationId) {
      setError("Votre profil donateur doit être créé avant de faire un don.");
      return;
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Saisissez un montant supérieur à zéro.");
      return;
    }
    if ((method === "BANK_TRANSFER" || method === "CHEQUE") && !receipt) {
      setError("Ajoutez la photo du reçu bancaire ou du chèque.");
      return;
    }
    if (receipt && (!receipt.type.match(/^(application\/pdf|image\/)/) || receipt.size > 10 * 1024 * 1024)) {
      setError("Le reçu doit être un PDF ou une image de 10 Mo maximum.");
      return;
    }
    setPending(true);
    setError("");
    setSuccess("");
    try {
      let receiptImage: string | undefined;
      if (receipt) {
        const storagePath = `donors/${user.uid}/receipts/${Date.now()}-${receipt.name}`;
        await uploadBytes(ref(storage, storagePath), receipt);
        receiptImage = await getDownloadURL(ref(storage, storagePath));
      }
      await createDonation({
        reference: `DON-${Date.now()}`,
        donorId,
        associationId,
        amount: numericAmount,
        donorName: user.displayName || "Donateur",
        donorEmail: user.email || "",
        method,
        receiptImage,
      });
      setAmount("");
      setReceipt(null);
      setSuccess("Votre don a été enregistré et sera vérifié par l'association.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d'enregistrer votre don.");
    } finally {
      setPending(false);
    }
  }

  return <section className="inner-page">
    <div className="page-intro"><div><p className="eyebrow">Espace donateur</p><h2>Faire un don</h2><p>Votre contribution sera suivie et confirmée par l&apos;association.</p></div><Link className="text-link dark-link" href="/donor/donations">← Historique des dons</Link></div>
    <form className="request-form request-form-wide" onSubmit={submit}>
      <label>Association bénéficiaire<select required value={associationId} onChange={(event) => setAssociationId(event.target.value)} disabled={loading || associations.length === 0}><option value="">Choisir une association</option>{associations.map((association) => <option value={association.id} key={association.id}>{association.name}</option>)}</select></label>
      <label>Montant du don (€)<input required min="1" step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="50.00" /></label>
      <label>Moyen de paiement<select value={method} onChange={(event) => setMethod(event.target.value as DonationMethod)}><option value="BANK_TRANSFER">Virement bancaire</option><option value="CASH">Espèces</option><option value="CHEQUE">Chèque</option></select></label>
      <label>Photo du reçu bancaire ou du chèque{method === "CASH" ? " (facultative)" : ""}<input type="file" accept=".pdf,.jpg,.jpeg,.png" required={method !== "CASH"} disabled={pending} onChange={selectReceipt} /><small>PDF ou image, 10 Mo maximum. Le reçu sera vérifié par l&apos;association.</small></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
      <button className="button" disabled={pending || loading}>{pending ? "Enregistrement..." : "Enregistrer mon don →"}</button>
    </form>
  </section>;
}
