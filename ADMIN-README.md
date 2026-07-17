# PIVUS — Espace d'administration & édition en ligne

Une fois connecté en admin, vous voyez une icône crayon sur chaque texte ;
cliquez, modifiez, validez.

---

## 1. Accès

- URL d'accès : **`/admin-pivus`**
  - En local / pour tester rapidement : ajoutez `#admin-pivus` à la fin de l'URL
    (ex. `monsite.com/#admin-pivus`).
- Identifiants par défaut :
  - **Identifiant :** `admin`
  - **Mot de passe :** `Pivus!2026`

> Aucun lien vers l'admin n'apparaît sur le site public. L'accès se fait
> uniquement en connaissant l'URL.

### Faire fonctionner l'URL propre `/admin-pivus` chez votre hébergeur
Sur un site statique, `/admin-pivus` doit être redirigé vers la page d'accueil.

- **Netlify** — fichier `_redirects` à la racine : `/admin-pivus  /index.html  200`
- **Vercel** — `vercel.json` :
  `{ "rewrites": [{ "source": "/admin-pivus", "destination": "/index.html" }] }`
- **Cloudflare Pages** — fichier `_redirects` (même syntaxe que Netlify).
- **Apache** — `.htaccess` : `RewriteRule ^admin-pivus$ /index.html [L]`

---

## 2. Changer le mot de passe

Le mot de passe n'est PAS stocké en clair : seule son empreinte (SHA-256 salé)
est dans le code. Pour le changer :

1. Console du navigateur, exécutez (en remplaçant le mot de passe) :
   ```js
   (async (p) => {
     const salt = 'pv_s1_a8f3c2e9';
     const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + p));
     console.log([...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join(''));
   })('MON-NOUVEAU-MOT-DE-PASSE');
   ```
2. Copiez l'empreinte, remplacez `PIVUS_AUTH.hash` dans `edit.jsx` (et
   `PIVUS_AUTH.user` pour l'identifiant), puis redéployez.

---

## 3. Modifier le contenu et le publier

1. Connectez-vous via `/admin-pivus`.
2. Le **Mode édition** est activé : cliquez sur un texte, modifiez (`Entrée`
   valide, `Échap` annule).
3. Cliquez **Exporter** → télécharge `content-overrides.json`.
4. Remplacez le fichier `content-overrides.json` à la racine du site par celui-ci,
   puis redéployez. Les nouveaux textes s'affichent pour **tous les visiteurs**.

> Tant que vous n'exportez/redéployez pas, vos modifications restent visibles
> uniquement dans votre navigateur (aperçu privé).

---

## 4. Niveau de sécurité — à lire

**Protection « côté navigateur ».** Sur un site purement statique, tout le code
est téléchargé par le visiteur : un mot de passe (même haché) finit par être
inspectable. Suffisant pour **empêcher l'accès occasionnel** et garder l'admin
discret, **mais ce n'est pas une sécurité forte**.

Ce qui EST déjà sûr : la publication réelle passe par un **redéploiement** (donc
accès au dépôt requis) ; mot de passe haché + salé, session expirante (8 h,
effacée à la fermeture de l'onglet), verrouillage après plusieurs tentatives.

### Passer à une vraie sécurité de production (recommandé)
Ajoutez un petit backend (fonction serverless qui vérifie le mot de passe contre
une variable d'environnement + stocke `content-overrides.json` dans un KV), ou
branchez un CMS « headless » (Decap/Sveltia) sur votre dépôt Git. Le code est
prêt : il suffit de remplacer la vérification locale dans `edit.jsx` par un appel
à votre API, et l'export par un `fetch` d'envoi. Dites-moi votre hébergeur et je
vous prépare ce backend.

---

## 5. Note sur la version « standalone » (fichier unique)
Le fichier HTML autonome n'est PAS le bon support pour l'admin : la route
`/admin-pivus` et la publication nécessitent un vrai hébergement. Déployez la
version multi-fichiers (PIVUS.html + assets) pour utiliser l'admin.
