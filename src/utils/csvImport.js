import Papa from "papaparse";
import { parseTags } from "./rankings";

// Le fichier réel d'export ressemble à ça (séparateur ; possible, colonne
// adversaire souvent sans en-tête) :
//   pseudo;score_quiz_game_quizz;date;;Défi
//   Fiona;375;17-juil;Stade Rennais;Général, Décembre, Bretagne
//
// On mappe les colonnes par mot-clé plutôt que par nom exact, pour rester
// robuste si l'en-tête change légèrement d'un export à l'autre.
function matrixToRows(matrix) {
  if (matrix.length === 0) return [];
  const header = matrix[0].map((h) => (h || "").toLowerCase().trim());

  const findCol = (...keywords) =>
    header.findIndex((h) => keywords.some((k) => h.includes(k)));

  const idx = {
    pseudo: findCol("pseudo"),
    score: findCol("score"),
    date: findCol("date"),
    tags: findCol("défi", "defi", "tag"),
  };
  const used = new Set(Object.values(idx).filter((i) => i >= 0));
  idx.adversaire = header.findIndex(
    (h, i) => !used.has(i) && (h.includes("adversaire") || h.includes("equipe") || h.includes("équipe"))
  );
  if (idx.adversaire === -1) {
    // colonne sans en-tête (cas le plus courant dans l'export réel) :
    // on prend la première colonne encore libre
    idx.adversaire = header.findIndex((h, i) => !used.has(i));
  }

  return matrix
    .slice(1)
    .filter((row) => row.some((cell) => (cell || "").trim()))
    .map((row) => ({
      pseudo: (row[idx.pseudo] || "").trim(),
      score: Number(row[idx.score]) || 0,
      date: (row[idx.date] || "").trim(),
      adversaire: (row[idx.adversaire] || "").trim(),
      tags: parseTags(row[idx.tags]),
    }))
    .filter((r) => r.pseudo);
}

export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => resolve(matrixToRows(results.data)),
      error: reject,
    });
  });
}

export function parseCsvText(text) {
  const results = Papa.parse(text, { header: false, skipEmptyLines: true });
  return matrixToRows(results.data);
}

// Récupère un Google Sheet publié sur le web au format CSV.
// Dans Google Sheets : Fichier > Partager > Publier sur le web > l'onglet
// concerné > format "Valeurs séparées par des virgules (.csv)".
export async function fetchCsvFromUrl(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Impossible de récupérer le fichier (HTTP ${res.status})`);
  }
  const text = await res.text();
  return parseCsvText(text);
}
