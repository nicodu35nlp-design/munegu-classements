import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TabNav from "../components/TabNav";
import RankingTable from "../components/RankingTable";
import MyRankBar from "../components/MyRankBar";
import PartnersFooter from "../components/PartnersFooter";
import { useQuizData } from "../hooks/useQuizData";
import { rankByMatch, rankBySeason, rankByTag, listMatches, listChallengeTags, findRank } from "../utils/rankings";
import crest from "../assets/monaco-crest.png";

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V19a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlayerView({ pseudo, onChangePseudo }) {
  const { rows, status } = useQuizData();
  const [tab, setTab] = useState("match");
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const matches = useMemo(() => listMatches(rows), [rows]);
  const lastMatch = matches[matches.length - 1] || null;
  const challengeTags = useMemo(() => listChallengeTags(rows), [rows]);
  const activeChallenge = selectedChallenge || challengeTags[0] || null;

  const currentRanking = useMemo(() => {
    if (tab === "match") return rankByMatch(rows, null);
    if (tab === "saison") return rankBySeason(rows);
    if (tab === "defis") return activeChallenge ? rankByTag(rows, activeChallenge) : [];
    return [];
  }, [tab, rows, activeChallenge]);

  const myRank = useMemo(() => findRank(currentRanking, pseudo), [currentRanking, pseudo]);

  // Le fond de page change selon l'onglet actif (blanc sur Match, rouge sur
  // Défis) — appliqué au <body> pour couvrir toute la largeur de l'écran.
  useEffect(() => {
    document.body.classList.toggle("bg-defis-theme", tab === "defis");
    return () => document.body.classList.remove("bg-defis-theme");
  }, [tab]);

  function handleBackToLogin() {
    onChangePseudo();
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-badge">
            <img src={crest} alt="AS Monaco" />
          </span>
          <span>Munegu Quiz</span>
        </div>
        <div className="header-actions">
          {status === "loading" && <span className="muted-status">Mise à jour…</span>}
          <button className="link-btn link-with-icon" onClick={handleBackToLogin}>
            <HomeIcon />
            Revenir à la page de connexion
          </button>
        </div>
      </header>

      <section className="hero hero-compact">
        <h1>Découvre tes classements</h1>
      </section>

      <section className="rankings">
        <TabNav active={tab} onChange={setTab} />

        {tab === "match" && (
          <div className="panel">
            {lastMatch && (
              <p className="match-subtitle">
                {lastMatch.date} — contre {lastMatch.adversaire}
              </p>
            )}
            <MyRankBar myRank={myRank} />
            <RankingTable rows={currentRanking} highlightPseudo={pseudo} />
          </div>
        )}

        {tab === "saison" && (
          <div className="panel">
            <MyRankBar myRank={myRank} />
            <RankingTable rows={currentRanking} highlightPseudo={pseudo} />
          </div>
        )}

        {tab === "defis" && (
          <div className="panel">
            {challengeTags.length === 0 ? (
              <p className="empty-state">Aucun défi disponible pour l'instant.</p>
            ) : (
              <>
                {challengeTags.length > 1 && (
                  <select value={activeChallenge} onChange={(e) => setSelectedChallenge(e.target.value)}>
                    {challengeTags.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
                <MyRankBar myRank={myRank} />
                <RankingTable rows={currentRanking} highlightPseudo={pseudo} />
              </>
            )}
          </div>
        )}
      </section>

      <PartnersFooter />

      <footer className="app-footer">
        <Link to="/backstage" className="footer-link">
          Espace équipe
        </Link>
      </footer>
    </div>
  );
}
