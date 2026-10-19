import Link from "next/link";
import AuthForm from "@/components/auth/auth-form";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  return <main className="auth-page"><div className="auth-visual"><Link className="brand auth-brand" href="/"><span className="brand-mark">♡</span><span><strong>Solidarité</strong><small>ENSEMBLE</small></span></Link><div><p className="eyebrow light-eyebrow">Votre espace personnel</p><h2>Chaque geste compte.<br /><em>Chaque personne aussi.</em></h2><p>Un espace simple pour agir, suivre votre impact et rester connecté à votre communauté.</p></div><span className="auth-quote">« La solidarité est la tendresse des peuples. »</span></div><AuthForm mode={mode} /></main>;
}
