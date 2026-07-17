# PIVUS — Site

Site statique + petit backend Netlify pour l'édition de contenu en direct.

## Déploiement

**Recommandé (édition en direct pour tous) — via GitHub :**
1. Mets ce dossier dans un dépôt GitHub.
2. Netlify → *Add new site → Import an existing project → GitHub* → sélectionne le dépôt.
   - Build command : *(vide)* · Publish directory : `.`
3. Netlify → *Site configuration → Environment variables* → ajoute
   `ADMIN_PASSWORD` = ton mot de passe admin. Puis *Trigger deploy*.

Netlify installe le backend (`netlify/functions` + `@netlify/blobs`) automatiquement.

**Simple (sans backend) — glisser-déposer :** dépose ce dossier sur
https://app.netlify.com/drop. Le site fonctionne ; l'admin passe en mode LOCAL
(édition + bouton « Exporter » + redéploiement pour publier).

## Administration

- Accès : `/admin-pivus`
- Mot de passe : la variable `ADMIN_PASSWORD` (mode en direct) ou `Pivus!2026` (mode local).
- En mode édition, **tous les textes** se modifient au clic (modifier, vider, restaurer).
  Les **photos de l'équipe** et la **vidéo de démo** s'ajoutent en collant une URL
  (bouton « Ajouter une image / vidéo »). La barre du bas indique le mode :
  **EN DIRECT** (publié pour tous) ou **LOCAL**.

## Vidéo de démo & page Équipe

- **Vidéo** : section « Démo » sur l'accueil, juste après le hero. Un placeholder
  s'affiche tant qu'aucune vidéo n'est définie ; en mode admin, colle un lien
  YouTube, Vimeo ou un fichier `.mp4`.
- **Équipe** : page `equipe.html` (lien « Équipe » dans le menu). Cartes
  modifiables — photo (carrée, coins arrondis), nom, fonction, description.

## Pages légales

`cgv.html`, `cgu.html`, `mentions-legales.html` sont des **trames** : complète les
passages en *italique* puis fais-les valider juridiquement avant publication.

## Structure

```
index.html              page principale
equipe.html             page Équipe
styles.css              styles
app.jsx components.jsx contact.jsx edit.jsx icons.jsx team.jsx   interface (React)
velocity.js fields.js    moteur des champs de vitesses
data.js                 contenus des sections
assets/pivus-mark.png   logo
cgv.html cgu.html mentions-legales.html   pages légales
netlify/functions/      backend : content.mjs, login.mjs
netlify.toml package.json   config du backend + accès /admin-pivus
```
