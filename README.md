# Munegu Quiz — Plateforme de classements

App React (Vite) qui affiche les classements du Munegu Quiz pendant les
matchs amicaux Summer Games : par match (calendrier fixe) et classement
général cumulé. Accès en lecture seule, via un pseudo vérifié contre les
vraies données — pas de compte, pas d'espace équipe séparé.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre ensuite `http://localhost:5173`.

## Où en est le projet

Ce qui fonctionne déjà :
- **Connexion par pseudo** — le pseudo saisi est vérifié contre les données
  réelles (Google Sheet) ; si aucune ligne ne correspond, le message "Pseudo
  non reconnu" s'affiche et l'accès est refusé
- **Synchronisation automatique** depuis le Google Sheet publié en CSV — la
  page se met à jour toute seule à chaque ouverture, aucune action manuelle
- **Onglet Match** : menu déroulant avec le calendrier fixe des matchs
  amicaux (voir `src/data/friendlyMatches.js`). Si un match n'a pas encore de
  données associées, "À venir" s'affiche à la place du tableau
- **Onglet Classement Général** : cumul de tous les points, toutes rencontres
  confondues
- Une barre "Toi" épinglée en haut de chaque classement, qui affiche ton rang
  même très loin dans la liste (tout en te laissant visible à ta vraie place)
- Podium avec médailles pour le top 3
- Bandeau partenaires avec vrais logos (en blanc, sur fond dégradé)
- DA "Summer Games" : dégradé bleu/rose/corail permanent, boutons jaunes,
  logo Summer Games sous le titre

Ce qu'il reste à faire (pistes pour la suite dans VS Code / Claude Code) :
1. **Déploiement** — Vercel (en cours au moment de la rédaction).
2. **Mettre à jour le calendrier des matchs** au fil de la saison dans
   `src/data/friendlyMatches.js` une fois la phase Summer Games terminée.
3. **Automatisation complète** — si Fastory confirme un export "on-demand",
   ce sera un lien à synchroniser en plus/à la place du Google Sheet, avec
   la même logique dans `src/utils/csvImport.js`.

## Utiliser un Google Sheet comme source de données

1. Dans le Google Sheet où sont collés les exports Fastory : `Fichier` >
   `Partager` > `Publier sur le web`.
2. Choisis l'onglet concerné, format **"Valeurs séparées par des virgules
   (.csv)"**, puis clique sur "Publier".
3. Copie le lien généré (il ressemble à
   `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`).
4. Ce lien est actuellement défini en dur comme valeur par défaut dans
   `src/config.js` (`DEFAULT_SHEET_CSV_URL`) — sans risque puisque c'est un
   lien public en lecture seule. Pour le changer, éditer cette valeur
   directement, ou définir la variable d'environnement `VITE_SHEET_CSV_URL`
   (prioritaire sur la valeur par défaut) si tu préfères ne pas toucher au
   code — utile notamment sur Vercel, dans les paramètres du projet.
5. À chaque nouveau quiz, ajoute simplement les lignes dans le Google Sheet —
   la page se resynchronise toute seule à chaque ouverture. Compte 1 à 5
   minutes de délai après une modification, le temps que Google régénère le
   CSV publié.

⚠️ Ce lien publié est en lecture seule mais public : n'importe qui l'ayant
peut lire les données (pas les modifier). Adapté à des pseudos + scores
publics ; à garder en tête si des colonnes plus sensibles étaient ajoutées.

## Format du fichier d'export attendu

Les colonnes sont reconnues par mot-clé dans l'en-tête (insensible à la
casse), pas par position stricte — donc robuste si l'ordre change un peu
d'un export à l'autre :

| colonne détectée | mot-clé recherché                | exemple |
|-------------------|-----------------------------------|---------|
| pseudo             | contient "pseudo"                  | `Nicolas` |
| score               | contient "score"                    | `500` |
| date                 | contient "date"                       | `10/07` (texte libre, affiché tel quel) |
| adversaire           | contient "adversaire", ou colonne sans en-tête | `Sporting Lisbonne` |
| tags                 | contient "défi", "defi" ou "tag"       | `Général, Juillet` (plusieurs tags séparés par une virgule) |

**Important pour l'onglet Match** : la colonne "adversaire" doit correspondre
exactement (insensible à la casse) au nom utilisé dans
`src/data/friendlyMatches.js` (ex. "Sporting Lisbonne", "Cercle Bruges"...)
pour que les points remontent sur le bon match.

La logique de reconnaissance des colonnes est dans `src/utils/csvImport.js`
(`matrixToRows`).

## Modifier le calendrier des matchs

`src/data/friendlyMatches.js` contient la liste fixe affichée dans le menu
déroulant de l'onglet Match. Format :

```js
{ opponent: "Sporting Lisbonne", date: "25 juillet" }
```

Le nom `opponent` doit correspondre à la colonne "adversaire" du fichier
d'export (voir ci-dessus).

## Modifier les partenaires

La liste des partenaires (logos, taille d'affichage par palier) se modifie
dans `src/data/partners.js`. Les logos sont stockés en version blanche dans
`src/assets/partners/` (conversion faite pour ressortir sur le fond dégradé)
— pour ajouter un nouveau partenaire, prévoir sa version blanche (fond
transparent, silhouette blanche) au même format.

## Structure du projet

```
src/
  App.jsx                 composant racine : connexion + page de classements
  config.js                 source de données par défaut (lien Google Sheet)
  components/
    TabNav.jsx               navigation Match / Classement Général
    RankingTable.jsx          tableau de classement (podium, surlignage)
    MyRankBar.jsx              barre "Toi" épinglée en haut du classement
    PartnersFooter.jsx          bandeau partenaires par paliers
  pages/
    LoginGate.jsx              connexion par pseudo (avec validation)
    PlayerView.jsx              page de classements
  hooks/
    useQuizData.js              synchronisation depuis le Google Sheet
  utils/
    rankings.js                 toute la logique d'agrégation des classements
    csvImport.js                 parsing CSV (papaparse)
  data/
    friendlyMatches.js           calendrier fixe des matchs amicaux
    partners.js                   liste des partenaires
    sampleData.js                  données de démo (si aucune source dispo)
  assets/
    monaco-crest.png               blason AS Monaco (blanc)
    summer-games-logo.png           logo Summer Games
    partners/                        logos partenaires (versions blanches)
  index.css                       styles (DA Summer Games)
```

Toute la logique de calcul est isolée dans `utils/rankings.js` : c'est le
fichier à lire en premier pour comprendre comment un classement est obtenu à
partir des lignes brutes.
