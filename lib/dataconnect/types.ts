import type { UserRole } from "@/lib/users/roles";

export type DataConnectRole = "DONOR" | "BENEFICIARY" | "SUPPLIER" | "STAFF" | "MANAGER" | "SUPER_ADMIN";

export function toDataConnectRole(role: UserRole): DataConnectRole {
  return role === "partner" ? "SUPPLIER" : role.toUpperCase() as DataConnectRole;
}

export type DataConnectUser = {
  id: string;
  role: DataConnectRole;
  fullName: string;
  email: string;
  phone?: string | null;
  region?: string | null;
  address?: string | null;
  active: boolean;
  twoFactorEnabled: boolean;
  notifyEmailSms: boolean;
  whatsappReminders: boolean;
  createdAt: string;
};

export type DonationRecord = {
  id?: string;
  reference: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  submittedAt: string;
  method: "BANK_TRANSFER" | "CASH" | "CHEQUE";
  status: "PENDING" | "CONFIRMED" | "REFUSED";
  receiptImage?: string | null;
  association?: { name: string } | null;
  campaign?: { name: string } | null;
  donor?: { user?: { id: string } | null } | null;
};

export type StaffAidRequestRecord = AidRequestRecord & {
  beneficiary?: { user?: { id: string; fullName: string; email: string } | null } | null;
  family?: { id: string; familyId: string; membersCount: number; childrenCount: number; region?: string | null } | null;
};

export type StaffSupportTicketRecord = {
  id: string;
  subject: string;
  message: string;
  relatedReference?: string | null;
  status: string;
  user?: { fullName: string; email: string } | null;
};

export type AdminAssociationRecord = {
  id: string;
  name: string;
  registrationNumber: string;
  region?: string | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
};

export type CampaignRecord = {
  id: string;
  name: string;
  type: "RAMADAN" | "AID_EL_FITR" | "AID_EL_ADHA" | "BACK_TO_SCHOOL" | "EMERGENCY" | "OTHER";
  startDate: string;
  endDate?: string | null;
  targetAmount?: number | null;
  active: boolean;
  association?: { id: string; name: string } | null;
};

export type CouponBatchRecord = {
  id: string;
  batchId: string;
  couponType: "FOOD_COUPON" | "MEDICAL" | "HOUSING" | "SCHOOL" | "EMERGENCY";
  couponCount: number;
  valueEach: number;
  totalReserved: number;
  expiryDate?: string | null;
  description?: string | null;
  createdAt: string;
  campaign?: { name: string } | null;
};

export type CouponRecord = {
  id: string;
  reference: string;
  code: string;
  type: CouponBatchRecord["couponType"];
  value: number;
  expiresAt?: string | null;
  status: "AVAILABLE" | "RESERVED" | "USED" | "EXPIRED" | "CANCELLED";
  family?: { familyId: string } | null;
  aidRequest?: { reference: string } | null;
};

export type ReportMetrics = {
  donations: Array<{ amount: number; status: "PENDING" | "CONFIRMED" | "REFUSED" }>;
  aidRequests: Array<{ submittedAt: string; status: AidRequestRecord["status"] }>;
  coupons: Array<{ status: CouponRecord["status"] }>;
};

export type StaffCouponRecord = CouponRecord;

export type FamilyExceptionCandidate = StaffAidRequestRecord;

export type ReportRecord = {
  id: string;
  period: string;
  distributionRate?: number | null;
  avgProcessingDays?: number | null;
  couponsUsedRate?: number | null;
  generatedAt: string;
  association?: { name: string } | null;
};

export type AuditLogRecord = {
  id: string;
  action: string;
  performedAt: string;
  targetRef?: string | null;
  details?: string | null;
  user?: { fullName: string; email: string } | null;
};

export type DonationMethod = "BANK_TRANSFER" | "CASH" | "CHEQUE";

export type AidRequestRecord = {
  id: string;
  reference: string;
  type: "FOOD_COUPON" | "MEDICAL" | "HOUSING" | "SCHOOL" | "EMERGENCY";
  requestedAmount?: number | null;
  mainReason?: string | null;
  description?: string | null;
  status: "PENDING" | "IN_REVIEW" | "INFO_REQUESTED" | "APPROVED" | "REJECTED" | "PAID";
  submittedAt: string;
  association?: { name: string } | null;
};

export type SupportingDocumentRecord = {
  id: string;
  fileName: string;
  fileType?: string | null;
  storagePath: string;
  uploadedAt: string;
  aidRequest?: { id: string; reference: string } | null;
};

export type BeneficiaryContext = {
  id: string;
  family: { id: string; familyId: string };
};

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export type ConversationMessage = {
  id: string;
  content: string;
  sentAt: string;
  sender: { id: string; fullName: string; role: DataConnectRole };
};

export type ConversationRecord = {
  id: string;
  department: "SUPPORT" | "REQUESTS" | "ACCOUNTING";
  lastMessageAt?: string | null;
  messages: ConversationMessage[];
};

export type AdminAssignmentData = {
  users: DataConnectUser[];
  associations: Array<{ id: string; name: string }>;
};

export type PaymentRecord = {
  id: string;
  paymentId: string;
  kind: "AID_DISBURSEMENT" | "SUPPLIER_REIMBURSEMENT";
  relatedRef?: string | null;
  amount: number;
  date: string;
  status: "PENDING" | "PAID";
  supplier?: { businessName: string; user?: { id: string } | null } | null;
  aidRequest?: { reference: string } | null;
};

export type SupplierServiceRecord = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price?: number | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  supplier?: { id: string; businessName: string } | null;
};

export type ServiceOrderRecord = {
  id: string;
  reference: string;
  quantity: number;
  totalAmount?: number | null;
  status: "REQUESTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  requestedAt: string;
  completedAt?: string | null;
  requestedBy?: { id: string } | null;
  service?: { name: string } | null;
  association?: { name: string } | null;
};
