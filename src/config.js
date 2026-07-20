// URL du Google Sheet publié en CSV — c'est LA source unique vue par tout le
// monde (joueurs comme équipe).
//
// Valeur par défaut ci-dessous (le lien étant public en lecture seule, donc
// sans risque à laisser dans le code). Pour la remplacer sans toucher au
// code — utile en production — définir la variable d'environnement Vite
// VITE_SHEET_CSV_URL (fichier .env, non commité), qui est alors prioritaire.
const DEFAULT_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4kVwxgmaKj9qdpRVNhroIIQg8Zv1MfCCzUlt0yK0Jg04MgK47ep3ioJI18bISWbXh2aeEeKkhazVe/pub?gid=0&single=true&output=csv";

export const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || DEFAULT_SHEET_CSV_URL;
