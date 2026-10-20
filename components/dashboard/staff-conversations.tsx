"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { addConversationParticipant, listMessagesForConversation, listSupportConversations, sendConversationMessage } from "@/lib/dataconnect/operations";
import type { ConversationRecord } from "@/lib/dataconnect/types";
import { useAuth } from "@/lib/firebase/auth-context";

export default function StaffConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const result = await listSupportConversations();
    setConversations(result.conversations);
    setSelected((current) => current || result.conversations[0]?.id || "");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load().catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger les conversations.")); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!selected) return;
    void listMessagesForConversation(selected).then((result) => setConversations((current) => current.map((conversation) => conversation.id === selected ? { ...conversation, messages: result.messages } : conversation))).catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger les messages."));
  }, [selected]);

  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const conversation = conversations.find((item) => item.id === selected);
    if (!user || !conversation || !message.trim()) return;
    try {
      setBusy(true);
      setError("");
      await addConversationParticipant({ conversationId: conversation.id, userId: user.uid });
      await sendConversationMessage({ conversationId: conversation.id, senderId: user.uid, content: message.trim() });
      setMessage("");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d’envoyer la réponse.");
    } finally {
      setBusy(false);
    }
  }

  const active = conversations.find((conversation) => conversation.id === selected);
  return <div className="support-grid"><div className="table-card"><div className="table-heading"><strong>Conversations</strong><span>{conversations.length}</span></div>{conversations.length === 0 && <div className="empty-request"><span>◌</span><h3>Aucune conversation</h3><p>Les nouveaux messages apparaîtront ici.</p></div>}{conversations.map((conversation) => <button className={`notification-row ${conversation.id === selected ? "unread" : ""}`} key={conversation.id} onClick={() => setSelected(conversation.id)}><span className="activity-dot donation">◌</span><span><strong>{conversation.department}</strong><small>{conversation.messages.at(-1)?.content || "Conversation vide"}</small></span></button>)}</div><div className="support-form"><h3>{active ? `Répondre · ${active.department}` : "Sélectionnez une conversation"}</h3>{active?.messages.map((item) => <p key={item.id}><strong>{item.sender.fullName}</strong><br />{item.content}</p>)}{active && <form onSubmit={reply}><label>Réponse<textarea required rows={4} value={message} onChange={(event) => setMessage(event.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy ? "Envoi..." : "Envoyer la réponse →"}</button></form>}</div></div>;
}
