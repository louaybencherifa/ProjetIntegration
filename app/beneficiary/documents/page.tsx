"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { createSupportingDocument, listAidRequestsForUser, listDocumentsForBeneficiary } from "@/lib/dataconnect/operations";
import type { AidRequestRecord, SupportingDocumentRecord } from "@/lib/dataconnect/types";
import { storage } from "@/lib/firebase/storage";
import { useAuth } from "@/lib/firebase/auth-context";

export default function BeneficiaryDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<SupportingDocumentRecord[]>([]);
  const [requests, setRequests] = useState<AidRequestRecord[]>([]);
  const [requestReference, setRequestReference] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([listDocumentsForBeneficiary(user.uid), listAidRequestsForUser(user.uid)])
      .then(([documentResult, requestResult]) => {
        setDocuments(documentResult.supportingDocuments);
        setRequests(requestResult.aidRequests);
        setRequestReference(requestResult.aidRequests[0]?.reference || "");
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos documents."));
  }, [user]);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user || !requestReference) {
      setError("Sélectionnez une demande avant d'ajouter un document.");
      return;
    }
    setPending(true); setError(""); setMessage("");
    try {
      const storagePath = `beneficiaries/${user.uid}/${requestReference}/${Date.now()}-${file.name}`;
      await uploadBytes(ref(storage, storagePath), file);
      const request = requests.find((item) => item.reference === requestReference);
      if (!request) throw new Error("La demande sélectionnée est introuvable.");
      await createSupportingDocument({ aidRequestId: request.id, fileName: file.name, fileType: file.type, storagePath });
      const result = await listDocumentsForBeneficiary(user.uid);
      setDocuments(result.supportingDocuments);
      setMessage("Document ajouté à votre dossier.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d'ajouter le document.");
    } finally {
      setPending(false);
      event.target.value = "";
    }
  }

  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Espace bénéficiaire</p><h2>Mes documents</h2><p>Ajoutez les justificatifs nécessaires à vos demandes d&apos;aide.</p></div></div><div className="request-form"><label>Demande concernée<select required value={requestReference} onChange={(event) => setRequestReference(event.target.value)}><option value="">Choisir une demande</option>{requests.map((request) => <option value={request.reference} key={request.reference}>{request.reference} · {request.type}</option>)}</select></label><label>Ajouter un fichier<input type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={pending || !requestReference} onChange={upload} /></label>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}</div><div className="table-card">{documents.length === 0 && <div className="empty-request"><span>▤</span><h3>Aucun document</h3><p>Les documents envoyés apparaîtront ici.</p></div>}{documents.map((document) => <div className="donation-row" key={document.id}><span className="donation-date">▤</span><div><strong>{document.fileName}</strong><small>{document.aidRequest?.reference || "Demande"} · {document.fileType || "Fichier"}</small></div><span className="pill confirmed">Envoyé</span></div>)}</div></section>;
}
