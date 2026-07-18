// URL du Google Sheet publié en CSV — c'est LA source unique vue par tout le
// monde (joueurs comme équipe). À définir une fois pour toutes au déploiement,
// via une variable d'environnement Vite (fichier .env, non commité) :
//   VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
//
// Tant qu'elle n'est pas définie, l'app utilise les données d'exemple et
// affiche un message d'aide sur la page /backstage.
export const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || "";

// Authentification de l'espace /backstage via Supabase Auth (voir README,
// section "Sécuriser l'espace équipe"). Les comptes ne sont pas ouverts au
// public : ils sont créés à la main, un par un, par un admin depuis le
// tableau de bord Supabase (Authentication > Users > Invite user).
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
