import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function BackstageGate({ children }) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (auth.loading) {
    return (
      <div className="gate">
        <p className="muted-status">Chargement…</p>
      </div>
    );
  }

  if (!auth.configured) {
    return (
      <div className="gate">
        <div className="gate-form">
          <h1>Espace équipe</h1>
          <p className="sync-status error">
            L'authentification n'est pas configurée sur ce déploiement
            (variables <code>VITE_SUPABASE_URL</code> et{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> manquantes). Voir le README,
            section "Sécuriser l'espace équipe".
          </p>
        </div>
      </div>
    );
  }

  if (auth.user) {
    return children({ user: auth.user, signOut: auth.signOut });
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    await auth.signIn(email, password);
    setSubmitting(false);
  }

  return (
    <div className="gate">
      <form className="gate-form" onSubmit={submit}>
        <h1>Espace équipe</h1>
        <p className="muted-status">Connexion réservée aux comptes créés par un admin.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
        {auth.error && <p className="sync-status error">{auth.error}</p>}
      </form>
    </div>
  );
}
