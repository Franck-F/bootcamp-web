# Bootcamp Web — API (Node.js + Express + Prisma + PostgreSQL)

## ✅ Objectif
Initialiser et exécuter l’API **en local, sans Docker**, avec migration Prisma appliquée et tests de santé OK.

---

## ⚙️ Prérequis
- **Node.js** ≥ 20 (testé avec v22.16)
- **npm** ≥ 10
- **PostgreSQL** ≥ 15 (service démarré)

---

## 📁 Structure (extrait)
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

## 🔐 Configuration (.env)
Dans `api/.env` :
```
DATABASE_URL="postgresql://postgres:admin@localhost:5432/sneakers?schema=public"
PORT=4000
NODE_ENV=development
BCRYPT_SALT_ROUNDS=10
```

---

## 🚀 Commandes exécutées (depuis la racine du repo)
```bash
make check-schema
make prisma-generate
make migrate                # MIGRATION=init par défaut
make dev
make db-health
```

### ✅ Résultats attendus
- `make check-schema` → confirme la présence de `api/prisma/schema.prisma`
- `make prisma-generate` → Prisma Client généré
- `make migrate` → migration `init` appliquée
- `make dev` → serveur dispo sur `http://localhost:4000`
- `make db-health` → `{"db":"ok"}`

Endpoints utiles :
- `GET http://localhost:4000/health` → `{"status":"ok"}`
- `GET http://localhost:4000/db/health` → `{"db":"ok"}`

---

## 🧾 Message de commit
Utilisé / recommandé pour tracer cette story :

```
feat(init): API locale ok (Node/Express + Prisma + PostgreSQL) — Epic: Initialisation du projet (SP:3)
```

---

## 🛠️ Astuces
- Si `P1000` (auth) côté Prisma : vérifier `api/.env` et `pg_hba.conf`, puis relancer `make migrate`.
- Arrêt du serveur dev : **Ctrl + C** dans le terminal.
