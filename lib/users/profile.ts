import { getDataConnectUser, upsertDataConnectUser } from "@/lib/dataconnect/operations";
import { toDataConnectRole } from "@/lib/dataconnect/types";
import type { UserRole } from "@/lib/users/roles";

export type UserProfile = {
  uid: string;
  role: UserRole;
  fullName: string;
  email: string;
  createdAt: string;
};

export async function saveUserProfile(profile: UserProfile) {
  await upsertDataConnectUser({
    id: profile.uid,
    role: toDataConnectRole(profile.role),
    fullName: profile.fullName,
    email: profile.email,
  });
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
