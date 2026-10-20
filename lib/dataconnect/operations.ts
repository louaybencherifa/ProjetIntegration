import { runMutation, runQuery } from "@/lib/dataconnect/client";
import type { AdminAssociationRecord, AidRequestRecord, AuditLogRecord, CampaignRecord, ConversationRecord, CouponBatchRecord, CouponRecord, DataConnectRole, DataConnectUser, DonationMethod, DonationRecord, NotificationRecord, PaymentRecord, ReportRecord, ServiceOrderRecord, StaffAidRequestRecord, StaffSupportTicketRecord, SupportingDocumentRecord, SupplierServiceRecord } from "@/lib/dataconnect/types";

type UserQuery = { users: DataConnectUser[] };
type DonationsQuery = { donations: DonationRecord[] };
type DonorContextQuery = { donors: Array<{ id: string }> };
type DonationAssociationsQuery = { associations: Array<{ id: string; name: string }> };
type AidRequestsQuery = { aidRequests: AidRequestRecord[] };
type DocumentsQuery = { supportingDocuments: SupportingDocumentRecord[] };
type NotificationsQuery = { notifications: NotificationRecord[] };
type MessagesQuery = { messages: import("@/lib/dataconnect/types").ConversationMessage[] };
type AssignmentDataQuery = import("@/lib/dataconnect/types").AdminAssignmentData;
type StaffAssignmentQuery = { associationStaffs: Array<{ id: string; association?: { id: string; name: string } | null; department?: "SUPPORT" | "REQUESTS" | "ACCOUNTING" | null; position?: string | null }> };
type ManagerAssignmentQuery = { associationManagers: Array<{ id: string }> };
type PaymentsQuery = { payments: PaymentRecord[] };
type ServicesQuery = { supplierServices: SupplierServiceRecord[] };
type ActiveServicesQuery = { supplierServices: SupplierServiceRecord[] };
type OrdersQuery = { serviceOrders: ServiceOrderRecord[] };
type StaffDonationsQuery = { donations: DonationRecord[] };
type StaffAidRequestsQuery = { aidRequests: StaffAidRequestRecord[] };
type StaffSupportTicketsQuery = { supportTickets: StaffSupportTicketRecord[] };
type AdminAssociationsQuery = { associations: AdminAssociationRecord[] };
type CampaignsQuery = { campaigns: CampaignRecord[] };
type CouponBatchesQuery = { couponBatches: CouponBatchRecord[] };
type CouponsQuery = { coupons: CouponRecord[] };
type FamilyCouponsQuery = { coupons: Array<{ id: string; status: CouponRecord["status"]; aidRequest?: { reference: string } | null }> };
type FamilyExceptionsQuery = { familyExceptions: Array<{ id: string }> };
type ReportMetricsQuery = import("@/lib/dataconnect/types").ReportMetrics;
type FamilyExceptionCandidatesQuery = { aidRequests: import("@/lib/dataconnect/types").FamilyExceptionCandidate[] };
type ManagerContextQuery = { associationManagers: Array<{ id: string; staff?: { association?: { id: string; name: string } | null } | null }> };
type ReportsQuery = { reports: ReportRecord[] };
type AdminUsersQuery = { users: DataConnectUser[] };
type AuditLogsQuery = { auditLogs: AuditLogRecord[] };
type SupplierContextQuery = { suppliers: Array<{ id: string; businessName: string; taxId: string; category?: string | null }> };
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

export function updateUserSettings(data: {
  id: string;
  fullName: string;
  phone?: string;
  region?: string;
  address?: string;
  notifyEmailSms: boolean;
  whatsappReminders: boolean;
}) {
  return runMutation("updateUserSettings", data);
}

export function listDonationsForUser(userId: string) {
  return runQuery<DonationsQuery, { userId: string }>("listDonationsForUser", { userId });
}

export function getDonorContext(userId: string) {
  return runQuery<DonorContextQuery, { userId: string }>("getDonorContext", { userId });
}

export function createDonorProfile(userId: string) {
  return runMutation("createDonorProfile", { userId });
}

export function createBeneficiaryProfile(data: {
  userId: string;
  familyKey: string;
  familyId: string;
  headOfFamily: string;
  membersCount: number;
  childrenCount: number;
  region?: string;
  cin: string;
}) {
  return runMutation("createBeneficiaryProfile", data);
}

export function createSupplierProfile(data: {
  userId: string;
  businessName: string;
  taxId: string;
  category?: string;
}) {
  return runMutation("createSupplierProfile", data);
}

export function listDonationAssociations() {
  return runQuery<DonationAssociationsQuery, Record<string, never>>("listDonationAssociations", {});
}

export function createDonation(data: {
  reference: string;
  donorId: string;
  associationId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  method: DonationMethod;
  receiptImage?: string;
}) {
  return runMutation("createDonation", data);
}

export function listAidRequestsForUser(userId: string) {
  return runQuery<AidRequestsQuery, { userId: string }>("listAidRequestsForUser", { userId });
}

export function listDocumentsForBeneficiary(userId: string) {
  return runQuery<DocumentsQuery, { userId: string }>("listDocumentsForBeneficiary", { userId });
}

export function createSupportingDocument(data: {
  aidRequestId: string;
  fileName: string;
  fileType?: string;
  storagePath: string;
}) {
  return runMutation("createSupportingDocument", data);
}

export function listNotificationsForUser(userId: string) {
  return runQuery<NotificationsQuery, { userId: string }>("listNotificationsForUser", { userId });
}

export function listPaymentsForSupplier(userId: string) {
  return runQuery<PaymentsQuery, { userId: string }>("listPaymentsForSupplier", { userId });
}

export function listServicesForSupplier(userId: string) {
  return runQuery<ServicesQuery, { userId: string }>("listServicesForSupplier", { userId });
}

export function listActiveSupplierServices() {
  return runQuery<ActiveServicesQuery, Record<string, never>>("listActiveSupplierServices", {});
}

export function createServiceOrder(data: {
  reference: string;
  serviceId: string;
  supplierId: string;
  associationId: string;
  requestedBy: string;
  quantity: number;
  totalAmount?: number;
}) {
  return runMutation("createServiceOrder", data);
}

export function getSupplierContext(userId: string) {
  return runQuery<SupplierContextQuery, { userId: string }>("getSupplierContext", { userId });
}

export function createSupplierService(data: {
  supplierId: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
}) {
  return runMutation("createSupplierService", data);
}

export function listOrdersForSupplier(userId: string) {
  return runQuery<OrdersQuery, { userId: string }>("listOrdersForSupplier", { userId });
}

export function markNotificationAsRead(id: string) {
  return runMutation<unknown, { id: string }>(
    "markNotificationAsRead",
    { id },
  );
}

export function listConversationsForUser(userId: string) {
  return runQuery<{ conversationParticipants: Array<{ conversation: Omit<ConversationRecord, "messages"> }> }, { userId: string }>("listConversationsForUser", { userId }).then((result) => ({ conversationParticipants: result.conversationParticipants.map((item) => ({ conversation: { ...item.conversation, messages: [] } })) }));
}

export function createConversation(data: {
  conversationId: string;
  userId: string;
  department: "SUPPORT" | "REQUESTS" | "ACCOUNTING";
  content: string;
}) {
  return runMutation("createConversation", data);
}

export function sendConversationMessage(data: {
  conversationId: string;
  senderId: string;
  content: string;
}) {
  return runMutation("sendConversationMessage", data);
}

export function listSupportConversations() {
  return runQuery<{ conversations: Array<Omit<ConversationRecord, "messages">> }, Record<string, never>>("listSupportConversations", {}).then((result) => ({ conversations: result.conversations.map((conversation) => ({ ...conversation, messages: [] })) }));
}

export function listMessagesForConversation(conversationId: string) {
  return runQuery<MessagesQuery, { conversationId: string }>("listMessagesForConversation", { conversationId });
}

export function addConversationParticipant(data: { conversationId: string; userId: string }) {
  return runMutation("addConversationParticipant", data);
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

export function listPendingDonations() {
  return runQuery<StaffDonationsQuery, Record<string, never>>("listPendingDonations", {});
}

export function markDonationVerified(data: {
  id: string;
  status: "CONFIRMED" | "REFUSED";
  verificationNote?: string;
  notifyUserId: string;
  notificationMessage: string;
}) {
  return runMutation("markDonationVerified", data);
}

export function listStaffAidRequests() {
  return runQuery<StaffAidRequestsQuery, Record<string, never>>("listStaffAidRequests", {});
}

export function listAvailableCouponsForAssignment() {
  return runQuery<CouponsQuery, Record<string, never>>("listAvailableCouponsForAssignment", {});
}

export function listCouponsForBeneficiary(userId: string) {
  return runQuery<CouponsQuery, { userId: string }>("listCouponsForBeneficiary", { userId });
}

export function listCouponsForFamily(familyId: string, userId: string) {
  return runQuery<FamilyCouponsQuery, { familyId: string; userId: string }>("listCouponsForFamily", { familyId, userId });
}

export function listFamilyExceptionsForRequest(aidRequestId: string, userId: string) {
  return runQuery<FamilyExceptionsQuery, { aidRequestId: string; userId: string }>("listFamilyExceptionsForRequest", { aidRequestId, userId });
}

export function assignCouponToAidRequest(data: {
  couponId: string;
  familyId: string;
  aidRequestId: string;
  notifyUserId: string;
  notificationMessage: string;
}) {
  return runMutation("assignCouponToAidRequest", data);
}

export function listFamilyExceptionCandidates() {
  return runQuery<FamilyExceptionCandidatesQuery, Record<string, never>>("listFamilyExceptionCandidates", {});
}

export function approveFamilyException(data: {
  aidRequestId: string;
  managerId: string;
  reason: string;
}) {
  return runMutation("approveFamilyException", data);
}

export function reviewAidRequest(data: {
  id: string;
  status: AidRequestRecord["status"];
  notifyUserId: string;
  notificationMessage: string;
}) {
  return runMutation("reviewAidRequest", data);
}

export function listSupportTickets() {
  return runQuery<StaffSupportTicketsQuery, Record<string, never>>("listSupportTickets", {});
}

export function updateSupportTicketStatus(data: { id: string; status: string }) {
  return runMutation("updateSupportTicketStatus", data);
}

export function listAdminAssociations() {
  return runQuery<AdminAssociationsQuery, Record<string, never>>("listAdminAssociations", {});
}

export function updateAssociationStatus(data: {
  id: string;
  status: AdminAssociationRecord["status"];
  actorId: string;
}) {
  return runMutation("updateAssociationStatus", data);
}

export function listManagerCampaigns() {
  return runQuery<CampaignsQuery, Record<string, never>>("listManagerCampaigns", {});
}

export function createCampaign(data: {
  associationId: string;
  name: string;
  type: CampaignRecord["type"];
  startDate: string;
  endDate?: string;
  targetAmount?: number;
}) {
  return runMutation("createCampaign", data);
}

export function updateCampaignStatus(data: { id: string; active: boolean }) {
  return runMutation("updateCampaignStatus", data);
}

export function listCouponBatches() {
  return runQuery<CouponBatchesQuery, Record<string, never>>("listCouponBatches", {});
}

export function getManagerContext(userId: string) {
  return runQuery<ManagerContextQuery, { userId: string }>("getManagerContext", { userId });
}

export function createCouponBatch(data: {
  batchId: string;
  managerId: string;
  campaignId: string;
  couponType: CouponBatchRecord["couponType"];
  couponCount: number;
  valueEach: number;
  totalReserved: number;
  expiryDate?: string;
  description?: string;
}) {
  return runMutation("createCouponBatch", data);
}

export function createCoupon(data: {
  reference: string;
  code: string;
  batchId: string;
  type: CouponRecord["type"];
  value: number;
  expiresAt?: string;
}) {
  return runMutation("createCoupon", data);
}

export function listCouponsForBatch(batchId: string) {
  return runQuery<CouponsQuery, { batchId: string }>("listCouponsForBatch", { batchId });
}

export function listExpiredCoupons(today: string) {
  return runQuery<CouponsQuery, { today: string }>("listExpiredCoupons", { today });
}

export function markCouponExpired(id: string) {
  return runMutation("markCouponExpired", { id });
}

export function getCouponByCode(code: string) {
  return runQuery<CouponsQuery, { code: string }>("getCouponByCode", { code });
}

export function redeemCoupon(data: { id: string; supplierId: string; redeemedAt: string; paymentId: string; paymentDate: string; amount: number; notifyUserId: string }) {
  return runMutation("redeemCoupon", data);
}

export function listPendingPayments() {
  return runQuery<PaymentsQuery, Record<string, never>>("listPendingPayments", {});
}

export function markPaymentPaid(data: { id: string; notifyUserId: string; actorId: string }) {
  return runMutation("markPaymentPaid", data);
}

export function listManagerReports() {
  return runQuery<ReportsQuery, Record<string, never>>("listManagerReports", {});
}

export function getManagerReportMetrics(associationId: string) {
  return runQuery<ReportMetricsQuery, { associationId: string }>("getManagerReportMetrics", { associationId });
}

export function createManagerReport(data: {
  associationId: string;
  managerId: string;
  period: string;
  distributionRate?: number;
  avgProcessingDays?: number;
  couponsUsedRate?: number;
}) {
  return runMutation("createManagerReport", data);
}

export function listUsersForAdmin() {
  return runQuery<AdminUsersQuery, Record<string, never>>("listUsersForAdmin", {});
}

export function listAdminAssignmentData() {
  return runQuery<AssignmentDataQuery, Record<string, never>>("listAdminAssignmentData", {});
}

export function getStaffAssignment(userId: string) {
  return runQuery<StaffAssignmentQuery, { userId: string }>("getStaffAssignment", { userId });
}

export function getManagerAssignment(staffId: string) {
  return runQuery<ManagerAssignmentQuery, { staffId: string }>("getManagerAssignment", { staffId });
}

export function assignStaffToAssociation(data: {
  staffId: string;
  userId: string;
  associationId: string;
  department?: "SUPPORT" | "REQUESTS" | "ACCOUNTING";
  position?: string;
}) {
  return runMutation("assignStaffToAssociation", data);
}

export function promoteStaffToManager(data: { managerId: string; staffId: string; actorId: string }) {
  return runMutation("promoteStaffToManager", data);
}

export function updateUserActiveStatus(data: { id: string; active: boolean; actorId: string }) {
  return runMutation("updateUserActiveStatus", data);
}

export function updateUserRole(data: { id: string; role: DataConnectRole; actorId: string }) {
  return runMutation("updateUserRole", data);
}

export function updateSupplierOrderStatus(data: {
  id: string;
  status: ServiceOrderRecord["status"];
  notifyUserId: string;
  actorId: string;
  targetRef: string;
  statusText: string;
}) {
  return runMutation("updateSupplierOrderStatus", data);
}

export function listAuditLogs() {
  return runQuery<AuditLogsQuery, Record<string, never>>("listAuditLogs", {});
}

export function createAuditLog(data: {
  userId: string;
  action: string;
  targetRef?: string;
  details?: string;
}) {
  return runMutation("createAuditLog", data);
}
