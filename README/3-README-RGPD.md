# 🛡️ Module RGPD — Bootcamp Web
API **Express + Prisma (PostgreSQL)** & Front **React + Vite**

Ce README explique **comment lancer, tester et présenter** la partie RGPD de ton projet e‑commerce :

- Bannière cookies **granulaire** (analytics / marketing / personnalisation), **non pré‑cochée**, **révocable** (13 mois max).
- Pages **Mes données**, **Contact DPO**, **Confidentialité**, **Mentions légales**, **CGV/CGU**.
- Endpoints backend pour **exercer les droits RGPD** : accès/export, rectification, effacement, portabilité, limitation, opposition marketing.
- **Audit** des actions et **preuve** du consentement.

---

## 📂 Arborescence pertinente

```
bootcamp-web/
├─ api/                         # Backend Node/Express/Prisma
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ migrations/…
│  └─ src/
│     ├─ index.ts               # Entrypoint API
│     ├─ prisma.ts              # PrismaClient
│     ├─ middlewares/devAuth.ts # Fake auth DEV (pose req.user)
│     └─ modules/rgpd/router.ts # Routes RGPD
├─ web/                         # Front React + Vite
│  ├─ index.html
│  ├─ vite.config.js            # Proxy /api → http://localhost:4000
│  └─ src/
│     ├─ main.jsx
│     ├─ main/App.jsx
│     └─ modules/rgpd/
│        ├─ ConsentBanner.jsx
│        └─ pages/
│           ├─ MyData.jsx
│           ├─ DPOContact.jsx
│           ├─ Privacy.jsx
│           ├─ Legal.jsx
│           └─ Terms.jsx
└─ Makefile                     # Cibles API + Front
```

---

## ✅ Prérequis

- **Node.js** 18+ et **npm**
- **PostgreSQL** en local (ex: base `sneakers` sur `localhost:5432`)
- Fichier **`api/.env`** avec au minimum :
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/sneakers?schema=public"
  PORT=4000
  DEV_FAKE_USER_ID=1        # active la fausse authentification en DEV
  ```
  > `DEV_FAKE_USER_ID` permet de tester les routes protégées sans vrai login.

---

## 🚀 Démarrage rapide

À la **racine** du repo :

```bash
# 1) Vérifier Prisma + BDD
make doctor
make check-schema

# 2) Générer client Prisma + migrations (si besoin)
make prisma-generate
make migrate MIGRATION="rgpd_init"   # optionnel si déjà migré

# 3) Lancer l'API (http://localhost:4000)
make dev
```

Dans **un autre terminal** :

```bash
# 4) Installer le front et le lancer (http://localhost:5173 ou 5174)
make web-install
make web-dev
```

> Vite choisit un port libre : 5173 (ou 5174 s’il est déjà utilisé).  
> Le **proxy** redirige `/api/*` vers `http://localhost:4000`.

---

## 🔌 Endpoints RGPD (backend)

Base: `http://localhost:4000/api/rgpd`

| Méthode | URL                       | Auth | Description |
|--------:|---------------------------|:----:|-------------|
| GET     | `/consent`                |  non | Récupère préférences consentement (cookie invité / BDD si connecté) |
| PUT     | `/consent`                |  non | Enregistre préférences (cookie `consent_v1`, **13 mois max**) |
| POST    | `/consent/revoke`         |  non | Révoque consentement (efface cookie, met tout à `false` si connecté) |
| GET     | `/me/export`              |  oui | **Droit d’accès** — export JSON (profil + consent, extensible) |
| GET     | `/me/portability.csv`     |  oui | **Portabilité** — CSV basique (id, email, prénom, nom) |
| PATCH   | `/me`                     |  oui | **Rectification** — met à jour email/prénom/nom/mot de passe (bcrypt) |
| DELETE  | `/me`                     |  oui | **Effacement** — supprime le compte (⚠️ irréversible) |
| POST    | `/me/restrict`            |  oui | **Limitation** — demande de gel temporaire (trace `DataRequest`) |
| POST    | `/me/opt-out-marketing`   |  oui | **Opposition marketing** — enregistre la demande |
| POST    | `/dpo/contact`            |  non | **Contact DPO** — sujet + message (à relayer par email/ticket) |

- **Traçabilité** : chaque action crée un **`AuditLog`** ; les demandes créent un **`DataRequest`** (suivi du délai ≤ 1 mois).
- **Sécurité** : CSP via **Helmet**, mots de passe **bcrypt**, endpoints sensibles **auth** (middleware `devAuth` pour le dev).

---

## 🖥️ Front React + Vite (fonctionnalités)

- **Bannière cookies** : composant `ConsentBanner.jsx`
  - Cases **non pré-cochées**.
  - Sauvegarde via `PUT /api/rgpd/consent`.
  - **Injection différée** des scripts (ex: GA4) **après consentement**.
  - Lien footer **“Gérer mes cookies”** → **révocation** via `POST /consent/revoke`.

- **Pages**
  - `/my-data` : export JSON/CSV, rectification, limitation, opposition marketing, suppression compte.
  - `/dpo` : formulaire de contact DPO.
  - `/privacy`, `/legal`, `/terms` : squelettes légaux à compléter (SIRET, hébergeur, DPO).

---

## 🧪 Tests rapides (cURL)

### Consentement (invité)
```bash
# Lire préférences (invité)
curl -c cookies.txt http://localhost:4000/api/rgpd/consent

# Enregistrer préférences (analytics: true)
curl -b cookies.txt -c cookies.txt -X PUT http://localhost:4000/api/rgpd/consent \
  -H "Content-Type: application/json" \
  -d '{"analytics":true,"marketing":false,"personalization":false,"version":"v1"}'

# Révoquer consentement
curl -b cookies.txt -X POST http://localhost:4000/api/rgpd/consent/revoke
```

### Droits utilisateur (dev fake-auth)
Assure-toi d’avoir `DEV_FAKE_USER_ID=1` dans `api/.env` et l’API en marche :
```bash
# Export JSON
curl http://localhost:4000/api/rgpd/me/export

# CSV portabilité
curl -L http://localhost:4000/api/rgpd/me/portability.csv -o portability.csv

# Rectification
curl -X PATCH http://localhost:4000/api/rgpd/me \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alice","lastName":"Dupont"}'
```

> En prod, remplace `devAuth` par ton vrai middleware d’auth (JWT, session, etc.).

---

## 🧩 Base de données (Prisma)

Modèles ajoutés (en plus de Users/Orders/Catalog) : **`Consent`**, **`DataRequest`**, **`AuditLog`**.

Commandes utiles :
```bash
make prisma-generate
make migrate MIGRATION="rgpd_init"
make studio
```

---

## 📋 Checklist conformité (rappel)

- [x] **Cases non pré‑cochées**  
- [x] **Granularité** par finalité (analytics/marketing/personnalisation)  
- [x] **Cookies non essentiels ≤ 13 mois** (cookie `consent_v1`)  
- [x] **Révocation facile** (lien “Gérer mes cookies”)  
- [x] **Politique de confidentialité** accessible en ≤ 2 clics  
- [x] **Mentions légales** (SIRET, hébergeur, contact)  
- [x] **Droits** (accès / portabilité / rectif / effacement / limitation / opposition) + **preuve** (`DataRequest`)  
- [x] **Sécurité** : bcrypt, Helmet/CSP, logs (`AuditLog`)  
- [x] **Registre des traitements** : à documenter côté produit/orga  

---

## 🛠️ Dépannage

- **“Prisma Schema not found”** : lance `make check-schema` (doit afficher `OK: api/prisma/schema.prisma`) ou migre avec `--schema=prisma/schema.prisma`.
- **Port 5173 déjà pris** : Vite démarre sur 5174 automatiquement (OK).
- **CORS / cookies** : le proxy Vite redirige `/api` → `:4000`, et l’API accepte `credentials: true`.
- **Routes `/me/*` renvoient 401** : assure-toi que `DEV_FAKE_USER_ID` est défini en dev, ou branche ton auth réelle.

---

## 🎤 Démo express (script de présentation)

1. Ouvre `http://localhost:5173` → la **bannière cookies** s’affiche (non pré‑cochée).  
2. Coche **Analytics** → **Enregistrer** → montre que GA4 ne s’injecte **qu’après consentement**.  
3. Va sur **Mes données** : export JSON + CSV, rectif rapide.  
4. Clique **Gérer mes cookies** (footer) → révocation → reload → bannière réapparaît.  
5. Mentionne **logs + demandes** (preuve pour CNIL).

---

## 🧰 Raccourcis Make utiles

```bash
# Backend
make dev               # API dev (http://localhost:4000)
make prisma-generate   # générer Prisma client
make migrate MIGRATION="rgpd_init"
make studio            # Prisma Studio
make health            # /health
make db-health         # /db/health

# Front
make web-install
make web-dev           # http://localhost:5173 (ou 5174)
make web-build
make web-preview

# Tout en parallèle
make dev-all           # API + Front
```
