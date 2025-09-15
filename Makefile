# Makefile (racine)

SHELL := bash
API_DIR := api
PORT ?= 4000
API_URL := http://localhost:$(PORT)

# Important: chemin RELATIF DEPUIS api/
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
