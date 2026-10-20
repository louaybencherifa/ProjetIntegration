export type UserRole = "donor" | "beneficiary" | "partner" | "staff" | "manager" | "super_admin";

export const roleDefinitions: Record<UserRole, {
  label: string;
  description: string;
  icon: string;
  home: string;
  navigation: Array<{ href: string; label: string; icon: string }>;
}> = {
  donor: {
    label: "Donateur",
    description: "Je souhaite soutenir des familles et des projets solidaires.",
    icon: "♡",
    home: "/donor/dashboard",
    navigation: [
      { href: "/donor/dashboard", label: "Vue d'ensemble", icon: "⌂" },
      { href: "/donor/donations", label: "Mes dons", icon: "♡" },
      { href: "/donor/impact", label: "Mon impact", icon: "✦" },
      { href: "/donor/notifications", label: "Notifications", icon: "◌" },
    ],
  },
  beneficiary: {
    label: "Bénéficiaire",
    description: "Je souhaite demander une aide et suivre mon accompagnement.",
    icon: "＋",
    home: "/beneficiary/dashboard",
    navigation: [
      { href: "/beneficiary/dashboard", label: "Vue d'ensemble", icon: "⌂" },
      { href: "/beneficiary/requests", label: "Mes demandes", icon: "＋" },
      { href: "/beneficiary/coupons", label: "Mes coupons", icon: "✦" },
      { href: "/beneficiary/documents", label: "Mes documents", icon: "▤" },
      { href: "/beneficiary/notifications", label: "Notifications", icon: "◌" },
    ],
  },
  partner: {
    label: "Partenaire",
    description: "Je souhaite proposer mes services à la communauté.",
    icon: "◆",
    home: "/partner/dashboard",
    navigation: [
      { href: "/partner/dashboard", label: "Vue d'ensemble", icon: "⌂" },
      { href: "/partner/orders", label: "Mes prestations", icon: "▤" },
      { href: "/partner/coupons", label: "Coupons", icon: "✦" },
      { href: "/partner/payments", label: "Mes paiements", icon: "€" },
      { href: "/partner/notifications", label: "Notifications", icon: "◌" },
    ],
  },
  staff: {
    label: "Staff",
    description: "Gestion opérationnelle des demandes et des dons.",
    icon: "◆",
    home: "/internal/staff",
    navigation: [
      { href: "/internal/staff", label: "Vue d'ensemble", icon: "⌂" },
      { href: "/internal/staff/donations", label: "Dons à vérifier", icon: "♡" },
      { href: "/internal/staff/requests", label: "Demandes à traiter", icon: "＋" },
      { href: "/internal/staff/support", label: "Support", icon: "◌" },
    ],
  },
  manager: {
    label: "Manager",
    description: "Pilotage d'une association et de ses campagnes.",
    icon: "★",
    home: "/internal/manager",
    navigation: [
      { href: "/internal/manager", label: "Vue d'ensemble", icon: "⌂" },
      { href: "/internal/manager/donations", label: "Reçus à vérifier", icon: "♡" },
      { href: "/internal/manager/exceptions", label: "Exceptions familiales", icon: "!" },
      { href: "/internal/manager/payments", label: "Remboursements", icon: "€" },
      { href: "/internal/manager/campaigns", label: "Campagnes", icon: "▤" },
      { href: "/internal/manager/coupons", label: "Coupons", icon: "✦" },
      { href: "/internal/manager/reports", label: "Rapports", icon: "◒" },
      { href: "/internal/manager/services", label: "Prestations", icon: "◆" },
    ],
  },
  super_admin: {
    label: "Super Admin",
    description: "Administration globale de la plateforme.",
    icon: "✹",
    home: "/internal/admin",
    navigation: [
      { href: "/internal/admin", label: "Vue d'ensemble", icon: "⌂" },
      { href: "/internal/admin/associations", label: "Associations", icon: "◆" },
      { href: "/internal/admin/users", label: "Utilisateurs", icon: "＋" },
      { href: "/internal/admin/assignments", label: "Affectations", icon: "◆" },
      { href: "/internal/admin/audit", label: "Journal d'audit", icon: "◌" },
    ],
  },
};

export const publicRoleDefinitions = {
  donor: roleDefinitions.donor,
  beneficiary: roleDefinitions.beneficiary,
  partner: roleDefinitions.partner,
};

export function isUserRole(value: unknown): value is UserRole {
  return value === "donor" || value === "beneficiary" || value === "partner" || value === "staff" || value === "manager" || value === "super_admin";
}
