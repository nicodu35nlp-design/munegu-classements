// Un "row" = une ligne du fichier d'export, une fois enrichie :
// { pseudo, score, date (texte libre, ex "17-juil"), adversaire, tags: string[] }
//
// Le mois, le défi géographique, la compétition, etc. sont tous portés par
// la colonne "tags" (ex: "Général, Décembre, Bretagne") plutôt que par des
// colonnes dédiées — c'est ainsi que le fichier d'export réel est rempli.

export function parseTags(rawTags) {
  if (!rawTags) return [];
  return String(rawTags)
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function sortDesc(list) {
  return [...list].sort((a, b) => b.total - a.total);
}

export function matchKey(row) {
  return `${row.date}__${row.adversaire}`;
}

export function listMatches(rows) {
  const map = new Map();
  rows.forEach((r) => {
    if (!r.adversaire) return;
    const key = matchKey(r);
    if (!map.has(key)) map.set(key, { key, date: r.date, adversaire: r.adversaire });
  });
  return [...map.values()];
}

export function latestMatchKey(rows) {
  const matches = listMatches(rows);
  return matches.length ? matches[matches.length - 1].key : null;
}

export function rankByMatch(rows, key) {
  const targetKey = key || latestMatchKey(rows);
  const filtered = rows.filter((r) => matchKey(r) === targetKey);
  return sortDesc(filtered.map((r) => ({ pseudo: r.pseudo, total: r.score })));
}

// Cumul par pseudo sur un sous-ensemble de lignes
function aggregateByPseudo(rows) {
  const map = new Map();
  rows.forEach((r) => {
    const cur = map.get(r.pseudo) || { pseudo: r.pseudo, total: 0, quizzes: 0 };
    cur.total += r.score;
    cur.quizzes += 1;
    map.set(r.pseudo, cur);
  });
  return sortDesc([...map.values()]);
}

export function rankBySeason(rows) {
  return aggregateByPseudo(rows);
}

export function rankByTag(rows, tag) {
  return aggregateByPseudo(rows.filter((r) => r.tags.includes(tag)));
}

const MONTHS_FR = [
  "janvier", "février", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "août", "aout", "septembre", "octobre", "novembre", "décembre", "decembre",
];

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isMonthTag(tag) {
  return MONTHS_FR.includes(normalize(tag));
}

export function listTags(rows) {
  const set = new Set();
  rows.forEach((r) => r.tags.forEach((t) => set.add(t)));
  return [...set].sort();
}

// Les tags "mois" (Décembre, Janvier...) et les tags "défi" (tout le reste :
// zone géographique, thématique...) sont affichés dans deux onglets séparés.
export function listMonthTags(rows) {
  return listTags(rows).filter(isMonthTag);
}

export function listChallengeTags(rows) {
  return listTags(rows).filter((t) => !isMonthTag(t));
}

// Récap personnel façon "Wrapped" pour un pseudo donné
export function personalRecap(rows, pseudo) {
  const mine = rows.filter((r) => r.pseudo.toLowerCase() === pseudo.toLowerCase());
  if (mine.length === 0) return null;

  const seasonRank = rankBySeason(rows);
  const seasonPos = seasonRank.findIndex((r) => r.pseudo.toLowerCase() === pseudo.toLowerCase()) + 1;

  const totalScore = mine.reduce((s, r) => s + r.score, 0);
  const bestMatch = [...mine].sort((a, b) => b.score - a.score)[0];

  return {
    pseudo: mine[0].pseudo,
    quizzesJoues: mine.length,
    totalScore,
    positionSaison: seasonPos,
    totalJoueurs: seasonRank.length,
    meilleurMatch: bestMatch,
    matches: mine,
  };
}

// Retrouve le rang d'un pseudo dans un classement déjà calculé (résultat de
// rankByMatch / rankByTag / rankBySeason...), pour la barre "toi" épinglée
// en haut de chaque classement.
export function findRank(rankedRows, pseudo) {
  if (!pseudo) return null;
  const index = rankedRows.findIndex((r) => r.pseudo.toLowerCase() === pseudo.toLowerCase());
  if (index === -1) return null;
  return { rank: index + 1, pseudo: rankedRows[index].pseudo, total: rankedRows[index].total };
}
