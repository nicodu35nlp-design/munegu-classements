export default function MyRankBar({ myRank }) {
  if (!myRank) return null;
  return (
    <div className="my-rank-bar">
      <span className="my-rank-label">Toi</span>
      <span className="my-rank-value">{myRank.rank}</span>
      <span className="my-rank-pseudo">{myRank.pseudo}</span>
      <span className="my-rank-score">{myRank.total} pts</span>
    </div>
  );
}
