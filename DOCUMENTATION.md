# Documentation du Projet SneakPeak

Bienvenue dans la documentation technique du projet SneakPeak, un site e-commerce de sneakers moderne et professionnel.

## Table des matières

1.  [Introduction](#introduction)
2.  [Stack Technique](#stack-technique)
3.  [Structure du Projet](#structure-du-projet)
4.  [Schéma de la Base de Données](#schéma-de-la-base-de-données)
5.  [API de Backend](#api-de-backend)
6.  [Composants de l'Interface Utilisateur](#composants-de-linterface-utilisateur)
7.  [Authentification et Rôles](#authentification-et-rôles)
8.  [Scripts Utilitaires](#scripts-utilitaires)

## 1. Introduction

Ce document fournit une vue d'ensemble détaillée de l'architecture, des fonctionnalités et de l'implémentation technique du projet SneakPeak.

## 2. Stack Technique

Le projet est construit avec les technologies suivantes :

-   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI, React Hook Form, Zod, Zustand
-   **Backend**: Next.js API Routes, Prisma ORM
-   **Base de données**: PostgreSQL
-   **Authentification**: NextAuth.js
-   **Déploiement**: Vercel (application), Railway (base de données)

## 3. Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── admin/             # Pages d'administration
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   ├── products/          # Pages produits
│   └── ...
├── components/            # Composants React
│   ├── admin/             # Composants d'administration
│   ├── ui/                # Composants UI de base
│   └── ...
├── lib/                   # Utilitaires et configuration
├── store/                 # Gestion d'état (Zustand)
└── types/                 # Types TypeScript
```

## 4. Schéma de la Base de Données

La base de données est gérée avec Prisma et PostgreSQL. Le schéma est défini dans `prisma/schema.prisma`.

### Modèles

| Modèle              | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `users`             | Stocke les informations des utilisateurs, y compris leur rôle.              |
| `products`          | Contient les détails des produits, tels que le nom, le prix, la description.|
| `brands`            | Représente les marques des produits.                                        |
| `categories`        | Définit les catégories de produits.                                         |
| `variants`          | Gère les variantes de produits (par exemple, taille, couleur, stock).       |
| `product_images`    | Stocke les URLs des images pour chaque produit.                             |
| `orders`            | Enregistre les commandes des utilisateurs.                                  |
| `order_items`       | Détaille les produits inclus dans chaque commande.                          |
| `shopping_carts`    | Gère le panier d'achat de chaque utilisateur.                               |
| `wishlist_items`    | Stocke la liste de souhaits des utilisateurs.                               |
| `permissions`       | Définit les permissions granulaires pour les rôles.                         |
| `role_permissions`  | Associe les permissions aux rôles.                                          |
| `user_sessions`     | Suit les sessions des utilisateurs.                                         |

### Énumérations

| Énumération      | Description                                | Valeurs Possibles                               |
| ---------------- | ------------------------------------------ | ----------------------------------------------- |
| `order_status`   | Représente le statut d'une commande.       | `pending`, `shipped`, `delivered`, `canceled`   |
| `payment_status` | Indique le statut du paiement.             | `pending`, `failed`, `refunded`                 |
| `roles`          | Définit les rôles des utilisateurs.        | `customer`, `moderator`, `admin`                |

## 5. API de Backend

L'API est construite avec les Next.js API Routes et fournit des endpoints RESTful pour interagir avec les données.

| Endpoint                               | Méthode | Description                                                                                             |
| -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `/api/auth/signup`                     | `POST`  | Crée un nouvel utilisateur.                                                                             |
| `/api/auth/change-password`            | `POST`  | Permet à un utilisateur de changer son mot de passe.                                                    |
| `/api/auth/update-profile`             | `POST`  | Met à jour le profil d'un utilisateur.                                                                  |
| `/api/products`                        | `GET`   | Récupère une liste de produits avec filtres, pagination et tri.                                         |
| `/api/products`                        | `POST`  | Crée un nouveau produit (admin/modérateur).                                                             |
| `/api/products/{id}`                   | `GET`   | Récupère les détails d'un produit spécifique.                                                           |
| `/api/cart`                            | `GET`   | Récupère le contenu du panier de l'utilisateur.                                                         |
| `/api/cart`                            | `POST`  | Ajoute un produit au panier.                                                                            |
| `/api/orders`                          | `GET`   | Récupère l'historique des commandes de l'utilisateur.                                                   |
| `/api/orders`                          | `POST`  | Crée une nouvelle commande.                                                                             |
| `/api/orders/{id}`                     | `GET`   | Récupère les détails d'une commande spécifique.                                                         |
| `/api/wishlist`                        | `GET`   | Récupère la liste de souhaits de l'utilisateur.                                                         |
| `/api/wishlist`                        | `POST`  | Ajoute un produit à la liste de souhaits.                                                               |
| `/api/wishlist/{productId}`            | `DELETE`| Supprime un produit de la liste de souhaits.                                                            |
| `/api/search/suggestions`              | `GET`   | Fournit des suggestions de recherche en temps réel.                                                     |
| `/api/stock`                           | `GET`   | Vérifie le stock d'un produit (probablement utilisé en interne).                                        |
| `/api/payment`                         | `POST`  | Gère le processus de paiement (simulation).                                                             |

## 6. Composants de l'Interface Utilisateur

Le projet utilise un système de composants modulaires et réutilisables, situés dans `src/components`.

### Composants principaux

| Composant                 | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| `Navigation`              | La barre de navigation principale du site.                                      |
| `Footer`                  | Le pied de page du site.                                                        |
| `HeroSection`             | La section principale de la page d'accueil.                                     |
| `FeaturedProducts`        | Affiche une sélection de produits mis en avant.                                 |
| `ProductGrid`             | Grille d'affichage des produits pour les pages de catalogue.                    |
| `ProductFilters`          | Barre latérale avec des filtres pour les produits.                              |
| `SearchBar`               | Barre de recherche avec autocomplétion.                                         |
| `CartSidebar`             | Panneau latéral affichant le contenu du panier.                                 |
| `CheckoutForm`            | Formulaire pour le processus de commande.                                       |
| `CookieConsent`           | Bannière pour le consentement aux cookies (RGPD).                               |

### Composants d'administration

| Composant                 | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| `AdminSidebar`            | La barre de navigation latérale pour le backoffice.                             |
| `DashboardStats`          | Affiche des statistiques clés sur le tableau de bord de l'administration.       |
| `RecentOrders`            | Liste les commandes récentes dans le backoffice.                                |
| `LowStockAlert`           | Alerte pour les produits avec un stock faible.                                  |

## 7. Authentification et Rôles

Le système d'authentification est basé sur **NextAuth.js**, configuré pour utiliser un `CredentialsProvider` pour l'authentification par email et mot de passe.

### Configuration (`src/lib/auth.ts`)

-   **Adapter**: `PrismaAdapter` est utilisé pour connecter NextAuth.js à la base de données PostgreSQL.
-   **Stratégie de session**: Les sessions sont gérées avec des **JSON Web Tokens (JWT)**, avec une durée de validité de 24 heures.
-   **Callbacks**: Les callbacks `jwt` et `session` sont utilisés pour enrichir le token et l'objet de session avec des informations supplémentaires, comme le rôle de l'utilisateur.

### Rôles des utilisateurs

Le système définit trois rôles, stockés dans le modèle `users` :

1.  **`customer`**: Le rôle par défaut pour les nouveaux utilisateurs. Ils peuvent parcourir les produits, passer des commandes et gérer leur propre profil.
2.  **`moderator`**: Peut gérer les produits et les commandes. Accès au backoffice avec des permissions limitées.
3.  **`admin`**: A un accès complet à toutes les fonctionnalités du backoffice, y compris la gestion des utilisateurs, des produits, des commandes et des paramètres du site.

La protection des routes et des endpoints de l'API est assurée en vérifiant le rôle de l'utilisateur dans la session.

## 8. Scripts Utilitaires

Le répertoire `scripts/` contient plusieurs scripts Node.js pour diverses tâches de maintenance, de test et de débogage.

## 9. Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Railway (pour la base de données)

### 1. Cloner le repository
```bash
git clone https://github.com/Franck-F/bootcamp-web.git
cd bootcamp-web
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de la base de données
1. Créer un projet sur [Railway](https://railway.app)
2. Ajouter une base de données PostgreSQL
3. Copier les variables de connexion

### 4. Variables d'environnement
Créer un fichier `.env.local` :
```env
# Base de données
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Railway (optionnel)
RAILWAY_STATIC_URL="your-railway-url"
```

### 5. Initialiser la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Peupler la base de données (optionnel)
npx prisma db seed
```

### 6. Démarrer le serveur de développement
```bash
npm run dev
```
Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 10. Déploiement sur Vercel

### 1. Connecter le repository
1. Aller sur [Vercel](https://vercel.com)
2. Importer le projet depuis GitHub
3. Sélectionner le repository `bootcamp-web`

### 2. Configuration des variables d'environnement
Dans Vercel, ajouter les variables :
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### 3. Déploiement automatique
Vercel déploiera automatiquement à chaque push sur la branche `main`.

| Script                        | Description                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `check-admin-users.js`        | Vérifie et liste les utilisateurs avec le rôle d'administrateur.                     |
| `check-brands.js`             | Vérifie l'intégrité des données des marques.                                         |
| `check-categories.js`         | Vérifie l'intégrité des données des catégories.                                      |
| `check-new-database.js`       | Script de test pour une nouvelle configuration de base de données.                   |
| `check-railway-db.js`         | Teste la connexion à la base de données Railway.                                     |
| `enhance-all-brands.js`       | Probablement pour enrichir les données des marques avec des informations supplémentaires. |
| `enhance-product-categories.js`| Enrichit les catégories de produits.                                                 |
| `fix-broken-images.js`        | Tente de réparer les liens d'images cassés dans la base de données.                   |
| `manual-ui-test.js`           | Script pour effectuer des tests d'interface utilisateur manuels ou semi-automatisés. |
| `reset-admin-password.js`     | Réinitialise le mot de passe d'un utilisateur administrateur.                        |
| `setup-new-database.js`       | Configure et initialise une nouvelle base de données.                                |
| `test-admin-api.js`           | Teste les endpoints de l'API réservés à l'administration.                            |
| `test-admin-connection.js`    | Teste la connexion de l'utilisateur admin.                                           |
| `test-admin-login.js`         | Simule une connexion d'administrateur.                                               |
| `test-api.js`                 | Script de test général pour l'API.                                                   |
| `test-category-pages.js`      | Teste le rendu et le fonctionnement des pages de catégories.                         |
| `test-new-api.js`             | Teste les nouveaux endpoints de l'API.                                               |
| `test-priority-brands.js`     | Teste la logique de priorisation des marques.                                        |
| `test-profile-update.js`      | Teste la mise à jour du profil utilisateur.                                          |
| `test-sizes.js`               | Teste la gestion des tailles de produits.                                            |
| `test-ui-pages.js`            | Script de test pour différentes pages de l'interface utilisateur.                    |
| `update-dates.js`             | Met à jour les dates dans la base de données (par exemple, pour des tests).          |
| `verify-db-source.js`         | Vérifie la source des données de la base de données.                                 |
