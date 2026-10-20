"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupplierContext, listOrdersForSupplier, listServicesForSupplier, updateSupplierOrderStatus } from "@/lib/dataconnect/operations";
import type { ServiceOrderRecord, SupplierServiceRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function PartnerOrdersPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<SupplierServiceRecord[]>([]);
  const [orders, setOrders] = useState<ServiceOrderRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([listServicesForSupplier(user.uid), listOrdersForSupplier(user.uid), getSupplierContext(user.uid)])
      .then(([serviceResult, orderResult]) => { setServices(serviceResult.supplierServices); setOrders(orderResult.serviceOrders); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos prestations."));
  }, [user]);

  async function changeStatus(id: string, status: ServiceOrderRecord["status"]) {
    try {
      const order = orders.find((item) => item.id === id);
      if (!user || !order?.requestedBy?.id) throw new Error("Le demandeur de cette commande est introuvable.");
      await updateSupplierOrderStatus({ id, status, notifyUserId: order.requestedBy.id, actorId: user.uid, targetRef: order.reference, statusText: status });
      if (!user) return;
      const result = await listOrdersForSupplier(user.uid);
      setOrders(result.serviceOrders);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La mise à jour de la demande a échoué.");
    }
  }
  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Espace partenaire</p><h2>Mes prestations</h2><p>Publiez vos services et suivez les demandes des associations.</p></div><Link className="button" href="/partner/orders/new">+ Proposer un service</Link></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="summary-strip"><div><span>Services actifs</span><strong>{services.filter((service) => service.status === "ACTIVE").length}</strong></div><div><span>Demandes reçues</span><strong>{orders.length}</strong></div><div><span>Terminées</span><strong>{orders.filter((order) => order.status === "COMPLETED").length}</strong></div></div><div className="table-card"><div className="table-heading"><strong>Demandes de prestation</strong><span>Data Connect</span></div>{orders.length === 0 && <div className="empty-request"><span>▤</span><h3>Aucune demande reçue</h3><p>Les demandes des associations apparaîtront ici.</p></div>}{orders.map((order) => <div className="donation-row" key={order.id}><span className="donation-date">▤<br /><small>{order.status}</small></span><div><strong>{order.service?.name || "Prestation"}</strong><small>{order.association?.name || "Association"} · {order.reference}</small></div><b>{order.totalAmount ? `${order.totalAmount.toFixed(2)} €` : "—"}</b><span className={`pill ${order.status === "COMPLETED" ? "confirmed" : "review"}`}>{order.status}</span>{order.status === "REQUESTED" && <button className="button compact" onClick={() => void changeStatus(order.id, "ACCEPTED")}>Accepter</button>}{order.status === "ACCEPTED" && <button className="button compact" onClick={() => void changeStatus(order.id, "IN_PROGRESS")}>Démarrer</button>}{order.status === "IN_PROGRESS" && <button className="button compact" onClick={() => void changeStatus(order.id, "COMPLETED")}>Terminer</button>}{order.status !== "COMPLETED" && order.status !== "CANCELLED" && <button className="button secondary compact" onClick={() => void changeStatus(order.id, "CANCELLED")}>Annuler</button>}</div>)}</div></section>;
}
