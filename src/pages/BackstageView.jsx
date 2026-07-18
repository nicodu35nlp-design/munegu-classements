import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuizData, getActiveSheetUrl, setSheetUrlOverride } from "../hooks/useQuizData";
import { analyzeRows } from "../utils/dataQuality";
import { SHEET_CSV_URL } from "../config";

function formatDate(iso) {
  if (!iso) return "jamais";
  return new Date(iso).toLocaleString("fr-FR");
}

export default function BackstageView({ user, signOut }) {
  const { rows, status, error, lastSync, sync, importFromFile } = useQuizData();
  const [overrideInput, setOverrideInput] = useState(getActiveSheetUrl());
  const fileInput = useRef(null);

  const warnings = useMemo(() => analyzeRows(rows), [rows]);

  function saveOverride(e) {
    e.preventDefault();
    setSheetUrlOverride(overrideInput.trim());
    sync();
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    await importFromFile(file);
    e.target.value = "";
  }

  return (
    <div className="app backstage-wide">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">AS</span>
          <span>Munegu Quiz — Espace équipe</span>
        </div>
        <div className="header-actions">
          <span className="muted-status">{user.email}</span>
          <button className="link-btn" onClick={signOut}>
            Se déconnecter
          </button>
          <Link to="/" className="footer-link">
            Voir la page joueur
          </Link>
        </div>
      </header>

      <section className="panel backstage-block">
        <h2>Source des données</h2>
        {!SHEET_CSV_URL && (
          <p className="sync-status warn">
            Aucune source par défaut n'est configurée pour ce déploiement
            (variable d'environnement <code>VITE_SHEET_CSV_URL</code>). Le
            lien saisi ci-dessous n'est mémorisé que sur ce navigateur — pour
            que tous les joueurs voient les mêmes données, il faut définir
            cette variable au déploiement (voir le README).
          </p>
        )}
        <form className="sheet-form" onSubmit={saveOverride}>
          <input
            type="url"
            placeholder="Lien CSV du Google Sheet publié"
            value={overrideInput}
            onChange={(e) => setOverrideInput(e.target.value)}
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Synchronisation…" : "Resynchroniser"}
          </button>
        </form>

        <div className="upload-secondary">
          <span>{rows.length} lignes chargées · dernière synchro : {formatDate(lastSync)}</span>
          <button className="link-btn" onClick={() => fileInput.current.click()}>
            ou importer un fichier CSV
          </button>
          <input ref={fileInput} type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
        </div>

        {status === "error" && error && <p className="sync-status error">{error}</p>}
        {status === "ok" && <p className="sync-status ok">Synchronisé.</p>}
      </section>

      <section className="panel backstage-block">
        <h2>Contrôle qualité</h2>
        {warnings.length === 0 ? (
          <p className="sync-status ok">Aucun souci détecté sur les {rows.length} lignes actuelles.</p>
        ) : (
          <ul className="warning-list">
            {warnings.map((w, i) => (
              <li key={i} className={"warning-item " + w.level}>
                {w.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel backstage-block">
        <h2>Aperçu brut ({rows.length} lignes)</h2>
        <div className="raw-table-wrap">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Pseudo</th>
                <th>Score</th>
                <th>Date</th>
                <th>Adversaire</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 200).map((r, i) => (
                <tr key={i}>
                  <td>{r.pseudo}</td>
                  <td>{r.score}</td>
                  <td>{r.date}</td>
                  <td>{r.adversaire}</td>
                  <td>{r.tags.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 200 && (
            <p className="muted-status">Aperçu limité aux 200 premières lignes.</p>
          )}
        </div>
      </section>
    </div>
  );
}
