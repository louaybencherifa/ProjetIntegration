"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createAidRequest, getBeneficiaryContext, listActiveAssociations } from "@/lib/dataconnect/operations";
import { useAuth } from "@/lib/firebase/auth-context";

export default function NewBeneficiaryRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [familyId, setFamilyId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [associationId, setAssociationId] = useState("");
  const [associations, setAssociations] = useState<Array<{ id: string; registrationNumber: string; name: string }>>([]);
  const [type, setType] = useState<"FOOD_COUPON" | "MEDICAL" | "HOUSING" | "SCHOOL" | "EMERGENCY">("FOOD_COUPON");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    Promise.all([getBeneficiaryContext(user.uid), listActiveAssociations()])
      .then(([context, associationResult]) => {
        setFamilyId(context.beneficiaries[0]?.family.id || "");
        setBeneficiaryId(context.beneficiaries[0]?.id || "");
        setAssociations(associationResult.associations);
        setAssociationId(associationResult.associations[0]?.id || "");
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de préparer le formulaire."));
  }, [user]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !beneficiaryId || !familyId || !associationId) { setError("Votre profil bénéficiaire doit être rattaché à une famille avant de créer une demande."); return; }
    setPending(true); setError("");
    try {
      await createAidRequest({ reference: `AR-${Date.now()}`, beneficiaryId, familyId, associationId, type, description });
      router.push("/beneficiary/requests");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Votre demande n'a pas pu être envoyée."); } finally { setPending(false); }
  }
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Bénéficiaire</p><h2>Nouvelle demande</h2><p>Expliquez-nous votre besoin. Vos informations restent confidentielles.</p></div></div><form className="request-form request-form-wide" onSubmit={submit}><label>Type d&apos;aide<select value={type} onChange={(event) => setType(event.target.value as typeof type)}><option value="FOOD_COUPON">Aide alimentaire</option><option value="MEDICAL">Aide médicale</option><option value="HOUSING">Aide au logement</option><option value="SCHOOL">Aide scolaire</option><option value="EMERGENCY">Aide urgente</option></select></label><label>Association destinataire<select required value={associationId} onChange={(event) => setAssociationId(event.target.value)}><option value="">Choisir une association</option>{associations.map((association) => <option value={association.id} key={association.id}>{association.name}</option>)}</select></label><label>Décrivez votre situation<textarea required rows={7} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Quelques mots sur votre besoin..." /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={pending}>{pending ? "Envoi..." : "Envoyer ma demande →"}</button></form></section>;
}
