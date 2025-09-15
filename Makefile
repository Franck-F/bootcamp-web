# Makefile (racine)
SHELL := bash
API_DIR := api
PORT ?= 4000
API_URL := http://localhost:$(PORT)
SCHEMA_REL := prisma/schema.prisma

.DEFAULT_GOAL := help

## ----- AIDE -----
.PHONY: help
help: ## Liste des commandes
	@echo "Commandes :"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' Makefile | sed -E 's/:.*?## / - /'

.PHONY: doctor
doctor: ## Vérifie node/npm/psql/prisma
	@echo "node: " && node -v
	@echo "npm : " && npm -v
	@echo "psql: " && (psql --version || echo 'psql non trouvé')
	@cd $(API_DIR) && npx prisma -v

## ----- INSTALL & ENV -----
.PHONY: install
install: ## Installe deps backend
	@cd $(API_DIR) && (npm ci || npm install)

.PHONY: env
env: ## Crée .env depuis .env.example si absent
	@test -f $(API_DIR)/.env && echo ".env existe déjà" || (cp $(API_DIR)/.env.example $(API_DIR)/.env && echo "Créé $(API_DIR)/.env")

## ----- PRISMA -----
.PHONY: prisma-generate
prisma-generate: ## Génère client Prisma
	@cd $(API_DIR) && npx prisma generate --schema=$(SCHEMA_REL)

.PHONY: migrate
migrate: ## Migrations dev (MIGRATION=init par défaut)
	@cd $(API_DIR) && npx prisma migrate dev --name "$${MIGRATION:-init}" --schema=$(SCHEMA_REL)

.PHONY: prisma-reset
prisma-reset: ## Reset BDD (destructive)
	@cd $(API_DIR) && npx prisma migrate reset --force --schema=$(SCHEMA_REL)

.PHONY: studio
studio: ## Prisma Studio
	@cd $(API_DIR) && npx prisma studio --schema=$(SCHEMA_REL)

## ----- BUILD & RUN -----
.PHONY: build
build: ## Compile TS -> dist
	@cd $(API_DIR) && npx tsc -p .

.PHONY: start
start: build ## Démarre app compilée
	@node $(API_DIR)/dist/index.js

.PHONY: dev
dev: ## Dev (hot reload)
	@cd $(API_DIR) && npx ts-node-dev --respawn --transpile-only src/index.ts

.PHONY: seed
seed: ## Seed TypeScript
	@cd $(API_DIR) && npx ts-node prisma/seed.ts

## ----- HEALTH -----
.PHONY: health
health: ## Ping /health
	@curl -sS $(API_URL)/health || true; echo

.PHONY: db-health
db-health: ## Ping /db/health
	@curl -sS $(API_URL)/db/health || true; echo

## ----- OUTILS -----
.PHONY: clean
clean: ## Supprime dist et node_modules backend
	@rm -rf $(API_DIR)/dist $(API_DIR)/node_modules && echo "Clean OK"

.PHONY: check-schema
check-schema: ## Vérifie l'existence du schema.prisma
	@test -f $(API_DIR)/$(SCHEMA_REL) && echo "OK: $(API_DIR)/$(SCHEMA_REL)" || (echo "Manquant: $(API_DIR)/$(SCHEMA_REL)"; exit 1)

## ----- RGPD: dépendances -----
.PHONY: rgpd-deps
rgpd-deps: ## Installe cookie-parser (+ types)
	@npm -C $(API_DIR) i cookie-parser
	@npm -C $(API_DIR) i -D @types/cookie-parser


# ====== WEB (React/Vite) ======
WEB_DIR := web
NPM_W   := npm -C $(WEB_DIR)

.PHONY: web-install web-dev web-build web-preview web-clean dev-all

web-install: ## Installe les dépendances du front
	$(NPM_W) install

web-dev: ## Lance le front en mode dev (http://localhost:5173)
	$(NPM_W) run dev

web-build: ## Build de production du front
	$(NPM_W) run build

web-preview: ## Prévisualise le build (serveur statique)
	$(NPM_W) run preview

web-clean: ## Supprime node_modules et dist du front
	rm -rf $(WEB_DIR)/node_modules $(WEB_DIR)/dist && echo "Front clean OK"

dev-all: ## Lance API + Front en parallèle
	@$(MAKE) -j2 dev web-dev
