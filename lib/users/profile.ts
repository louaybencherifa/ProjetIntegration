import { createBeneficiaryProfile, createDonorProfile, createSupplierProfile, getDataConnectUser, getDonorContext, upsertDataConnectUser } from "@/lib/dataconnect/operations";
import { toDataConnectRole } from "@/lib/dataconnect/types";
import type { UserRole } from "@/lib/users/roles";

export type UserProfile = {
  uid: string;
  role: UserRole;
  fullName: string;
  email: string;
  createdAt: string;
  beneficiary?: {
    cin: string;
    familyId: string;
    headOfFamily: string;
    membersCount: number;
    childrenCount: number;
    region?: string;
  };
  supplier?: {
    businessName: string;
    taxId: string;
    category?: string;
  };
};

export async function saveUserProfile(profile: UserProfile) {
  await upsertDataConnectUser({
    id: profile.uid,
    role: toDataConnectRole(profile.role),
    fullName: profile.fullName,
    email: profile.email,
  });
  if (profile.role === "donor") {
    const donor = await getDonorContext(profile.uid);
    if (donor.donors.length === 0) {
      await createDonorProfile(profile.uid);
    }
  } else if (profile.role === "beneficiary" && profile.beneficiary) {
    await createBeneficiaryProfile({ userId: profile.uid, familyKey: crypto.randomUUID(), ...profile.beneficiary });
  } else if (profile.role === "partner" && profile.supplier) {
    await createSupplierProfile({ userId: profile.uid, ...profile.supplier });
  }
}

export async function getUserProfile(uid: string) {
  const result = await getDataConnectUser(uid);
  const user = result.users[0];
  if (!user) return null;
  return {
    uid: user.id,
    role: user.role === "SUPPLIER" ? "partner" : user.role.toLowerCase() as UserRole,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  };
}
