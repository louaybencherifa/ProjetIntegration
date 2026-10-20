"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createConversation, listConversationsForUser, listMessagesForConversation, sendConversationMessage } from "@/lib/dataconnect/operations";
import type { ConversationRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function Conversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState<ConversationRecord["department"]>("SUPPORT");
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const result = await listConversationsForUser(user.uid);
    const items = result.conversationParticipants.map((item) => item.conversation);
    setConversations(items);
    setSelected((current) => current || items[0]?.id || "");
  }, [user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos conversations."));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!selected) return;
    void listMessagesForConversation(selected).then((result) => setConversations((current) => current.map((conversation) => conversation.id === selected ? { ...conversation, messages: result.messages } : conversation))).catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger les messages."));
  }, [selected]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !content.trim()) return;
    try {
      setBusy(true);
      setError("");
      if (selected) {
        await sendConversationMessage({ conversationId: selected, senderId: user.uid, content: content.trim() });
      } else {
        await createConversation({ conversationId: crypto.randomUUID(), userId: user.uid, department, content: content.trim() });
      }
      setContent("");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d'envoyer le message.");
    } finally {
      setBusy(false);
    }
  }

  const active = conversations.find((conversation) => conversation.id === selected);
  return <div className="support-grid"><div className="table-card"><div className="table-heading"><strong>Mes conversations</strong><span>{conversations.length}</span></div>{conversations.length === 0 && <p className="empty-request">Aucune conversation. Écrivez à l&apos;équipe pour commencer.</p>}{conversations.map((conversation) => <button className={`notification-row ${conversation.id === selected ? "unread" : ""}`} key={conversation.id} onClick={() => setSelected(conversation.id)}><span className="activity-dot donation">◌</span><span><strong>{conversation.department}</strong><small>{conversation.messages.at(-1)?.content || "Conversation"}</small></span></button>)}</div><div className="support-form"><h3>{active ? `Conversation ${active.department.toLowerCase()}` : "Nouvelle conversation"}</h3>{active && <div className="stacked-content">{active.messages.map((message) => <p key={message.id}><strong>{message.sender.id === user?.uid ? "Vous" : message.sender.fullName}</strong><br />{message.content}</p>)}</div>}<form onSubmit={submit}><label>Service<select value={department} onChange={(event) => setDepartment(event.target.value as ConversationRecord["department"])} disabled={Boolean(active)}><option value="SUPPORT">Support</option><option value="REQUESTS">Demandes d&apos;aide</option><option value="ACCOUNTING">Comptabilité</option></select></label><label>Message<textarea required rows={4} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Écrivez votre message..." /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy ? "Envoi..." : "Envoyer le message →"}</button></form></div></div>;
}
