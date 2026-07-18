# Munegu Quiz — Plateforme de classements

App React (Vite) qui affiche les classements multi-critères du Munegu Quiz : par
match, mensuel, saisonnier, par compétition et par défi/tag. Accès en lecture
seule via recherche de pseudo, sans compte.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre ensuite `http://localhost:5173`.

## Où en est le projet

## Deux vues séparées

- **`/`** — page joueur, publique : recherche par pseudo, classements. Aucun
  bouton de synchronisation ni contrôle visible, la page se met à jour toute
  seule depuis la source configurée.
- **`/backstage`** — espace équipe, protégé par une vraie connexion (voir
  section suivante). C'est ici que se gèrent : le lien Google Sheet, la
  resynchronisation manuelle, l'import de fichier CSV en secours, un
  contrôle qualité basique (lignes suspectes, pseudos orthographiés
  différemment...), et un aperçu brut des données.

## Modifier les partenaires

La liste des partenaires (et leur taille d'affichage par palier) se modifie
dans `src/data/partners.js`. Pour l'instant ce sont des noms en texte
(placeholder) ; pour passer à de vrais logos, remplace le `<span>` par une
balise `<img src={logo} alt={name} />` dans `src/components/PartnersFooter.jsx`
et adapte `partners.js` pour y stocker un chemin d'image plutôt qu'un simple
nom.

## Sécuriser l'espace équipe (Supabase Auth)

`/backstage` est protégée par une vraie authentification par email/mot de
passe via [Supabase](https://supabase.com) — pas de mot de passe unique
partagé, chaque personne a son propre compte.

**Mise en place (à faire une fois, ~15 minutes) :**

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau
   projet (gratuit à ce volume).
2. Dans `Project Settings > API`, récupère l'**URL du projet** et la clé
   **`anon public`**.
3. Renseigne-les dans `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (fichier
   `.env` en local, variables d'environnement Vercel/Netlify en production).
4. Dans `Authentication > Providers`, vérifie que "Email" est activé.
5. Dans `Authentication > Settings`, **désactive "Allow new users to sign
   up"** — important : sans ça, n'importe qui pourrait créer un compte
   lui-même et accéder à `/backstage`.
6. Pour chaque personne de l'équipe (toi, Pierre, Adrien...) : `Authentication
   > Users > Add user > Create new user`, avec son email et un mot de passe
   temporaire à lui communiquer (il pourra le changer ensuite via "Forgot
   password" si tu configures l'envoi d'email, sinon en redéfinir un vous-mêmes
   directement dans le dashboard).

Une fois ça fait, `/backstage` demande un vrai email + mot de passe, et
seules les personnes que tu as explicitement ajoutées peuvent s'y connecter.

**Pourquoi Supabase plutôt qu'un mot de passe unique :** un mot de passe
partagé (l'ancienne version) ne permet pas de savoir qui accède à quoi, ni de
retirer l'accès à une seule personne si besoin. Avec des comptes individuels,
on peut désactiver l'accès de quelqu'un sans changer le mot de passe de toute
l'équipe.

**Aller plus loin (pas fait ici, pistes pour la suite) :** Supabase peut
aussi héberger les données elles-mêmes (table Postgres à la place du Google
Sheet), avec des règles d'accès (Row Level Security) qui autorisent la
lecture publique mais réservent l'écriture aux comptes authentifiés. C'est
l'étape "Niveau 3" mentionnée en conversation — pas nécessaire tant que le
volume reste faible, mais ça reste la suite logique si le projet grandit,
puisque l'authentification est déjà en place.

## La source de données

Le lien du Google Sheet publié en CSV est défini en dur comme valeur par
défaut dans `src/config.js` (`DEFAULT_SHEET_CSV_URL`) — sans risque puisque
c'est un lien public en lecture seule. Ça garantit que tout le monde (joueurs
comme équipe) voit les mêmes données dès l'ouverture, sans configuration à
refaire à chaque déploiement ou réimport GitHub/StackBlitz.

Pour changer cette source sans toucher au code (utile en production, ou pour
tester un lien différent sans le committer), une variable d'environnement
reste prioritaire si elle est définie :

```
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
VITE_BACKSTAGE_PASSPHRASE=un-mot-de-passe-a-vous
```

En local, créer un fichier `.env` à la racine avec ces variables (déjà
ignoré par `.gitignore` — donc à recréer à chaque réimport StackBlitz, ce qui
n'est plus nécessaire pour un usage courant grâce à la valeur par défaut
ci-dessus).

Ce qui fonctionne déjà :
- **Synchronisation automatique** depuis le Google Sheet publié en CSV
  configuré (voir plus bas) — la page joueur se met à jour toute seule
- Import manuel d'un fichier CSV en secours, depuis `/backstage`
- Calcul de 3 classements : par match, par tag générique (mois, défi,
  géographie... tout ce qui est écrit dans la colonne "Défi"), et sur la
  saison entière
- Recherche par pseudo avec récap façon "Wrapped" (quiz joués, score cumulé,
  position saison, meilleur match)
- Contrôle qualité basique sur `/backstage` (lignes incomplètes, scores à 0,
  pseudos orthographiés différemment selon les lignes)
- Un jeu de données d'exemple (`src/data/sampleData.js`) est affiché par
  défaut tant qu'aucune source n'a été configurée

Ce qu'il reste à faire (pistes pour la suite dans VS Code / Claude Code) :
1. **Passer d'un Google Sheet à un vrai backend, si le volume le justifie un
   jour** — Supabase ou Firebase, mêmes principes qu'un import CSV mais avec
   une vraie base de données. Pas urgent : le Google Sheet suffit largement
   pour ce volume de données.
2. **Déploiement** — Vercel ou Netlify (cf. cahier des charges).
3. **Design final** — la charte actuelle reprend le rouge AS Monaco (#D50B32)
   en CSS simple (`src/index.css`), à enrichir avec la police "AS Monaco
   Diagonale" et les visuels de marque si besoin (voir le PPT de cadrage
   fourni séparément).
4. **Automatisation complète** — si Fastory confirme un export "on-demand",
   ce sera un lien à synchroniser en plus/à la place du Google Sheet, avec
   la même logique dans `src/utils/csvImport.js`.

## Utiliser un Google Sheet comme source de données

1. Dans le Google Sheet où tu colles tes exports Fastory : `Fichier` >
   `Partager` > `Publier sur le web`.
2. Choisis l'onglet concerné, format **"Valeurs séparées par des virgules
   (.csv)"**, puis clique sur "Publier".
3. Copie le lien généré (il ressemble à
   `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`).
4. Mets ce lien dans la variable d'environnement `VITE_SHEET_CSV_URL` au
   déploiement (voir section ci-dessus) — c'est ce qui fait que **tous les
   joueurs** voient les mêmes données, pas juste toi. Tu peux aussi le coller
   temporairement dans `/backstage` pour tester en local avant de déployer.
5. À chaque nouveau quiz, ajoute simplement les lignes dans le Google Sheet —
   la page joueur se resynchronise toute seule à chaque ouverture. Depuis
   `/backstage`, un bouton "Resynchroniser" permet de forcer une mise à jour
   immédiate pour vérifier que tout est bien remonté. Compte 1 à 5 minutes de
   délai après une modification, le temps que Google régénère le CSV publié.

⚠️ Tant qu'aucun mot de passe/protection n'est ajouté, ce lien est public :
n'importe qui ayant l'URL peut lire les données (pas les modifier). C'est
adapté à des pseudos + scores publics, à garder en tête si d'autres colonnes
sensibles venaient à être ajoutées un jour.

## Format du fichier d'export attendu

Les colonnes sont reconnues par mot-clé dans l'en-tête (insensible à la
casse), pas par position stricte — donc robuste si l'ordre change un peu
d'un export à l'autre :

| colonne détectée | mot-clé recherché      | exemple                          |
|-------------------|-------------------------|-----------------------------------|
| pseudo             | contient "pseudo"        | `Fiona`                            |
| score               | contient "score"          | `375`                               |
| date                 | contient "date"             | `17-juil` (texte libre, affiché tel quel) |
| adversaire           | contient "adversaire", ou colonne sans en-tête | `Stade Rennais` |
| tags                 | contient "défi", "defi" ou "tag" | `Général, Décembre, Bretagne` (plusieurs tags séparés par une virgule) |

C'est exactement le format que tu utilises déjà (`pseudo;score_quiz_game_quizz;date;;Défi`) —
le mois, la compétition ou un défi géographique sont tous traités comme de
simples tags dans la même colonne, comme tu le fais actuellement.

La logique de reconnaissance des colonnes est dans `src/utils/csvImport.js`
(`matrixToRows`).

## Structure du projet

```
src/
  App.jsx               composant racine, gère les onglets et l'état
  components/
    TabNav.jsx           navigation entre les 5 vues de classement
    RankingTable.jsx      tableau générique pseudo/score
    PseudoSearch.jsx      recherche + récap "Wrapped"
    UploadPanel.jsx        import du CSV d'export
  utils/
    rankings.js            toute la logique d'agrégation des classements
    csvImport.js            parsing CSV (papaparse)
  data/
    sampleData.js           données de démo
  index.css                 styles (charte AS Monaco)
```

Toute la logique de calcul est isolée dans `utils/rankings.js` : c'est le
fichier à lire en premier pour comprendre comment un classement est obtenu à
partir des lignes brutes.
