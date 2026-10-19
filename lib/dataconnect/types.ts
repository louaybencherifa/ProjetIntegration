import type { UserRole } from "@/lib/users/roles";

export type DataConnectRole = "DONOR" | "BENEFICIARY" | "SUPPLIER";

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
};

export type AidRequestRecord = {
  reference: string;
  type: "FOOD_COUPON" | "MEDICAL" | "HOUSING" | "SCHOOL" | "EMERGENCY";
  requestedAmount?: number | null;
  mainReason?: string | null;
  description?: string | null;
  status: "PENDING" | "IN_REVIEW" | "INFO_REQUESTED" | "APPROVED" | "REJECTED" | "PAID";
  submittedAt: string;
  association?: { name: string } | null;
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

export type PaymentRecord = {
  paymentId: string;
  kind: "AID_DISBURSEMENT" | "SUPPLIER_REIMBURSEMENT";
  relatedRef?: string | null;
  amount: number;
  date: string;
  status: "PENDING" | "PAID";
};
