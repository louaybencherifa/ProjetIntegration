import { runMutation, runQuery } from "@/lib/dataconnect/client";
import type { AidRequestRecord, DataConnectRole, DataConnectUser, DonationRecord, NotificationRecord, PaymentRecord } from "@/lib/dataconnect/types";

type UserQuery = { users: DataConnectUser[] };
type DonationsQuery = { donations: DonationRecord[] };
type AidRequestsQuery = { aidRequests: AidRequestRecord[] };
type NotificationsQuery = { notifications: NotificationRecord[] };
type PaymentsQuery = { payments: PaymentRecord[] };
type AssociationsQuery = { associations: Array<{ id: string; registrationNumber: string; name: string }> };
type BeneficiaryContextQuery = { beneficiaries: import("@/lib/dataconnect/types").BeneficiaryContext[] };

export function getDataConnectUser(id: string) {
  return runQuery<UserQuery, { id: string }>("getUserById", { id });
}

export function upsertDataConnectUser(data: {
  id: string;
  role: DataConnectRole;
  fullName: string;
  email: string;
}) {
  return runMutation("upsertUserProfile", data);
}

export function listDonationsForUser(userId: string) {
  return runQuery<DonationsQuery, { userId: string }>("listDonationsForUser", { userId });
}

export function listAidRequestsForUser(userId: string) {
  return runQuery<AidRequestsQuery, { userId: string }>("listAidRequestsForUser", { userId });
}

export function listNotificationsForUser(userId: string) {
  return runQuery<NotificationsQuery, { userId: string }>("listNotificationsForUser", { userId });
}

export function listPaymentsForSupplier(userId: string) {
  return runQuery<PaymentsQuery, { userId: string }>("listPaymentsForSupplier", { userId });
}

export function markNotificationAsRead(id: string) {
  return runMutation<unknown, { id: string }>(
    "markNotificationAsRead",
    { id },
  );
}

export function createSupportTicket(data: {
  userId: string;
  subject: string;
  message: string;
  relatedReference?: string;
}) {
  return runMutation("createSupportTicket", data);
}

export function createAidRequest(data: {
  reference: string;
  beneficiaryId: string;
  familyId: string;
  associationId: string;
  type: AidRequestRecord["type"];
  description: string;
}) {
  return runMutation("createAidRequest", data);
}

export function listActiveAssociations() {
  return runQuery<AssociationsQuery, Record<string, never>>("listActiveAssociations", {});
}

export function getBeneficiaryContext(userId: string) {
  return runQuery<BeneficiaryContextQuery, { userId: string }>("getBeneficiaryContext", { userId });
}
