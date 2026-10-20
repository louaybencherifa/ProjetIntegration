"use client";

import { useEffect, useState } from "react";
import { listNotificationsForUser, markNotificationAsRead } from "@/lib/dataconnect/operations";
import type { NotificationRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function DonorNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    listNotificationsForUser(user.uid)
      .then((result) => setNotifications(result.notifications))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos notifications."));
  }, [user]);

  async function read(notification: NotificationRecord) {
    if (notification.isRead) return;
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, isRead: true } : item));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de mettre à jour la notification.");
    }
  }

  return <section className="inner-page"><div className="page-intro"><div><p className="eyebrow">Espace donateur</p><h2>Mes notifications</h2><p>Retrouvez les confirmations et les nouvelles liées à vos dons.</p></div></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="table-card">{notifications.length === 0 && !error && <div className="empty-request"><span>◌</span><h3>Aucune notification</h3><p>Nous vous informerons ici de l&apos;activité de vos dons.</p></div>}{notifications.map((notification) => <button className={`notification-row ${notification.isRead ? "" : "unread"}`} key={notification.id} onClick={() => read(notification)}><span className="activity-dot donation">◌</span><span><strong>{notification.title}</strong><small>{notification.message}</small><small>{formatDate(notification.createdAt)}</small></span>{!notification.isRead && <b>Nouveau</b>}</button>)}</div></section>;
}
