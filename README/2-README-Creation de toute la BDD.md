# Bootcamp Web — Guide Makefile (API Node/Express + Prisma + PostgreSQL)

Ce README documente **toutes les commandes du Makefile** placé à la racine du projet (`bootcamp-web/`).  
Environnement validé sous **Windows (Git Bash / MINGW64)**, macOS et Linux.

---

## ⚙️ Prérequis
- **Node.js ≥ 20** (ex. v22.16) & **npm ≥ 10**
- **PostgreSQL ≥ 15** (service démarré, accès `psql`)
- **GNU Make**
- **curl** (fourni avec Git Bash)  
- (Optionnel) **Prisma Studio** sera ouvert via `npx prisma studio`

---

## 📁 Arborescence utile
```
bootcamp-web/
├─ Makefile
└─ api/
   ├─ src/index.ts
   ├─ prisma/
   │  └─ schema.prisma
   ├─ .env
   ├─ package.json
   └─ tsconfig.json
```

---

## 🔐 Fichier d’environnement (`api/.env`)
> Utilisateur **postgres** avec mot de passe **admin** (usage local de dev)

```
DATABASE_URL="postgresql://postgres:admin@localhost:5432/sneakers?schema=public"
PORT=4000
NODE_ENV=development
BCRYPT_SALT_ROUNDS=10
```

---

## 🧰 Référence des commandes Makefile

> Toutes les commandes se lancent **depuis la racine** du repo (`bootcamp-web/`).  
> Exemple : `make doctor`

### Aide & vérifications
- `make help` — Liste les commandes disponibles
- `make doctor` — Affiche versions `node`, `npm`, `psql`, `prisma`

### Installation & environnement
- `make install` — Installe les dépendances **backend** (`api/`)
- `make env` — Crée `api/.env` depuis `.env.example` **si absent**

### Prisma / Base de données
- `make check-schema` — Vérifie la présence de `api/prisma/schema.prisma`
- `make prisma-generate` — Génère le **Prisma Client**
- `make migrate` — Applique les migrations dev (nom par défaut **init**).  
  • Personnaliser : `make migrate MIGRATION="catalog_auth_orders_cart"`
- `make prisma-reset` — **Reset destructif** de la base (pour repartir propre)
- `make studio` — Ouvre **Prisma Studio** (GUI DB) dans le navigateur

### Build & Run
- `make build` — Compile TypeScript → `api/dist`
- `make start` — Démarre l’app **compilée**
- `make dev` — Démarre en **dev** (hot reload) sur `http://localhost:4000`

### Seed & Health
- `make seed` — Exécute le **seed TypeScript** (`prisma/seed.ts`)  
  • Si besoin des types : `npm -C api i -D @types/bcrypt`
- `make health` — `GET /health` → `{"status":"ok"}`
- `make db-health` — `GET /db/health` → `{"db":"ok"}`

### Outils
- `make clean` — Supprime `api/dist` et `api/node_modules`
- `make db-bootstrap` — Affiche les commandes SQL pour créer user/db (si tu n’utilises pas `postgres`)

---

## 🚀 Workflows conseillés

### 1) Première mise en place (local, sans Docker)
```bash
make doctor
make check-schema
make install
make env                     # si .env.example existe
make prisma-generate
make migrate                 # ou: make migrate MIGRATION=init
make dev                     # serveur sur http://localhost:4000
make db-health
```

### 2) Après modification du schéma Prisma
```bash
make prisma-generate
make migrate MIGRATION="feat_new_tables"
```

### 3) Réinitialiser la base et réappliquer un jeu de données
```bash
make prisma-reset
make migrate MIGRATION="reset"
make build
make seed
```

### 4) Build & exécution en mode compilé
```bash
make build
make start
```

---

## ✅ Critères d’acceptation (Story: Init locale sans Docker)
- `make prisma-generate` réussit
- `make migrate` applique les migrations
- `make dev` lance l’API et `/health` répond `{"status":"ok"}`
- `make db-health` répond `{"db":"ok"}`

---

## 🧯 Dépannage

### P1000 (Authentication failed)
- Vérifier `api/.env` (`postgres:admin`), redémarrer PostgreSQL si besoin
- `psql "postgresql://postgres:admin@localhost:5432/sneakers" -c "SELECT current_user;"`
- Vérifier `pg_hba.conf` : `host all all 127.0.0.1/32 scram-sha-256` (ou `md5`), puis **redémarrer** le service

### Could not load --schema
- Lancer `make check-schema`
- Assure-toi que le Makefile pointe vers `api/prisma/schema.prisma` et que tu exécutes **à la racine**

### Types bcrypt manquants (TS7016)
```bash
npm -C api i -D @types/bcrypt
make build
```

### Conflit de port (4000)
- Modifier `PORT` dans `api/.env` puis relancer `make dev`

---

## 🧾 Message de commit (exemple)
```
feat(init): pipeline Makefile + migrations Prisma + API dev OK — Epic: Initialisation du projet (SP:3)
```

---

## 📌 Notes
- Les chemins Prisma sont **relatifs à `api/`** dans le Makefile, car chaque commande `cd` dans `api/` avant d’appeler Prisma.
- Utiliser l’utilisateur `postgres` en local est acceptable pour aller vite. En production, créer un **utilisateur applicatif dédié** avec droits minimaux.
