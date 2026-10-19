export type UserRole = "donor" | "beneficiary" | "partner";

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
      { href: "/partner/payments", label: "Mes paiements", icon: "€" },
      { href: "/partner/notifications", label: "Notifications", icon: "◌" },
    ],
  },
};

export function isUserRole(value: unknown): value is UserRole {
  return value === "donor" || value === "beneficiary" || value === "partner";
}
