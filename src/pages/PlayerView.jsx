import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TabNav from "../components/TabNav";
import RankingTable from "../components/RankingTable";
import MyRankBar from "../components/MyRankBar";
import PartnersFooter from "../components/PartnersFooter";
import { useQuizData } from "../hooks/useQuizData";
import { rankByOpponent, rankBySeason, findRank } from "../utils/rankings";
import { friendlyMatches } from "../data/friendlyMatches";
import crest from "../assets/monaco-crest.png";
import summerGamesLogo from "../assets/summer-games-logo.png";

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
  const [selectedOpponent, setSelectedOpponent] = useState(friendlyMatches[0].opponent);

  const selectedMatch = friendlyMatches.find((m) => m.opponent === selectedOpponent) || friendlyMatches[0];
  const matchRanking = useMemo(() => rankByOpponent(rows, selectedOpponent), [rows, selectedOpponent]);
  const generalRanking = useMemo(() => rankBySeason(rows), [rows]);

  const currentRanking = tab === "match" ? matchRanking : generalRanking;
  const myRank = useMemo(() => findRank(currentRanking, pseudo), [currentRanking, pseudo]);

  return (
    <div className="page-vibrant">
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
          <button className="link-btn link-with-icon" onClick={onChangePseudo}>
            <HomeIcon />
            Revenir à la page de connexion
          </button>
        </div>
      </header>

      <section className="hero hero-compact">
        <h1>Découvre tes classements</h1>
        <img src={summerGamesLogo} alt="Summer Games" className="hero-sg-logo" />
      </section>

      <section className="rankings">
        <TabNav active={tab} onChange={setTab} />

        {tab === "match" && (
          <div className="panel">
            <select value={selectedOpponent} onChange={(e) => setSelectedOpponent(e.target.value)}>
              {friendlyMatches.map((m) => (
                <option key={m.opponent} value={m.opponent}>
                  {m.opponent} — {m.date}
                </option>
              ))}
            </select>
            <p className="match-subtitle">
              {selectedMatch.date} — contre {selectedMatch.opponent}
            </p>
            {matchRanking.length === 0 ? (
              <p className="empty-state">À venir</p>
            ) : (
              <>
                <MyRankBar myRank={myRank} />
                <RankingTable rows={matchRanking} highlightPseudo={pseudo} />
              </>
            )}
          </div>
        )}

        {tab === "general" && (
          <div className="panel">
            <MyRankBar myRank={myRank} />
            <RankingTable rows={generalRanking} highlightPseudo={pseudo} />
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
    </div>
  );
}
