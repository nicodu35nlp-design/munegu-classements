import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TabNav from "../components/TabNav";
import RankingTable from "../components/RankingTable";
import MyRankBar from "../components/MyRankBar";
import PartnersFooter from "../components/PartnersFooter";
import { useQuizData } from "../hooks/useQuizData";
import {
  rankByMatch,
  rankBySeason,
  rankByTag,
  listMatches,
  listMonthTags,
  listChallengeTags,
  findRank,
} from "../utils/rankings";
import { clearActivePseudo } from "./LoginGate";
import crest from "../assets/monaco-crest.png";

export default function PlayerView({ pseudo, onChangePseudo }) {
  const { rows, status } = useQuizData();
  const [tab, setTab] = useState("match");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const matches = useMemo(() => listMatches(rows), [rows]);
  const lastMatch = matches[matches.length - 1] || null;
  const monthTags = useMemo(() => listMonthTags(rows), [rows]);
  const challengeTags = useMemo(() => listChallengeTags(rows), [rows]);

  const activeMonth = selectedMonth || monthTags[0] || null;
  const activeChallenge = selectedChallenge || challengeTags[0] || null;

  const currentRanking = useMemo(() => {
    if (tab === "match") return rankByMatch(rows, null);
    if (tab === "mois") return activeMonth ? rankByTag(rows, activeMonth) : [];
    if (tab === "saison") return rankBySeason(rows);
    if (tab === "defis") return activeChallenge ? rankByTag(rows, activeChallenge) : [];
    return [];
  }, [tab, rows, activeMonth, activeChallenge]);

  const myRank = useMemo(() => findRank(currentRanking, pseudo), [currentRanking, pseudo]);

  function handleChangePseudo() {
    clearActivePseudo();
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
          <button className="link-btn" onClick={handleChangePseudo}>
            Changer de pseudo
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

        {tab === "mois" && (
          <div className="panel">
            {monthTags.length === 0 ? (
              <p className="empty-state">Aucun mois disponible pour l'instant.</p>
            ) : (
              <>
                <select value={activeMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  {monthTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <MyRankBar myRank={myRank} />
                <RankingTable rows={currentRanking} highlightPseudo={pseudo} />
              </>
            )}
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
                <select value={activeChallenge} onChange={(e) => setSelectedChallenge(e.target.value)}>
                  {challengeTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
