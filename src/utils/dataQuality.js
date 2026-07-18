// Petits contrôles utiles pour repérer une ligne mal remplie avant qu'elle
// ne fausse un classement, affichés sur la page /backstage.
export function analyzeRows(rows) {
  const warnings = [];

  const missingMatchInfo = rows.filter((r) => !r.date || !r.adversaire);
  if (missingMatchInfo.length > 0) {
    warnings.push({
      level: "info",
      message: `${missingMatchInfo.length} ligne(s) sans date/adversaire — comptées dans le classement saison uniquement, absentes des vues "par match" et "par défi/mois".`,
    });
  }

  const zeroScores = rows.filter((r) => r.score === 0);
  if (zeroScores.length > 0) {
    warnings.push({
      level: "warn",
      message: `${zeroScores.length} ligne(s) à score 0 — à vérifier (score réellement nul, ou erreur d'export ?).`,
    });
  }

  const pseudoVariants = new Map();
  rows.forEach((r) => {
    const key = r.pseudo.toLowerCase();
    if (!pseudoVariants.has(key)) pseudoVariants.set(key, new Set());
    pseudoVariants.get(key).add(r.pseudo);
  });
  const inconsistent = [...pseudoVariants.entries()].filter(([, variants]) => variants.size > 1);
  if (inconsistent.length > 0) {
    warnings.push({
      level: "warn",
      message: `${inconsistent.length} pseudo(s) écrits différemment selon les lignes (ex. casse différente) : ${inconsistent
        .map(([, variants]) => [...variants].join(" / "))
        .join(", ")}.`,
    });
  }

  return warnings;
}
