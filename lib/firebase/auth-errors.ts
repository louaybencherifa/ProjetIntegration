export function getAuthErrorMessage(error: unknown) {
  const code = error instanceof Error && "code" in error ? String(error.code) : "";
  const messages: Record<string, string> = {
    "auth/invalid-credential": "Email ou mot de passe incorrect.",
    "auth/email-already-in-use": "Cette adresse email est déjà utilisée.",
    "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
    "auth/invalid-email": "Cette adresse email n'est pas valide.",
    "auth/popup-closed-by-user": "La fenêtre de connexion a été fermée.",
    "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
  };
  return messages[code] || "Une erreur est survenue. Vérifiez vos informations et réessayez.";
}
