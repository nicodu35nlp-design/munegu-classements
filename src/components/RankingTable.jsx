const MEDALS = ["🥇", "🥈", "🥉"];

export default function RankingTable({ rows, highlightPseudo, pointsLabel = "Points" }) {
  if (rows.length === 0) {
    return <p className="empty-state">Aucune donnée pour cette sélection.</p>;
  }

  const isHighlighted = (pseudo) =>
    highlightPseudo && pseudo.toLowerCase() === highlightPseudo.toLowerCase();

  return (
    <table className="ranking-table">
      <thead>
        <tr>
          <th className="col-rank">Rang</th>
          <th className="col-score">{pointsLabel}</th>
          <th>Pseudo</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const rank = i + 1;
          const rowClasses = [
            rank <= 3 ? `podium podium-${rank}` : "",
            isHighlighted(r.pseudo) ? "highlight" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <tr key={r.pseudo} className={rowClasses}>
              <td className="col-rank">
                {rank <= 3 ? <span className="medal">{MEDALS[rank - 1]}</span> : rank}
              </td>
              <td className="col-score">{r.total}</td>
              <td>{r.pseudo}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
