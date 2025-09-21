# 🛒 Sneakers Store - E-commerce Moderne

Un site e-commerce ultra moderne avec gestion de stock avancée, développé avec Next.js, TypeScript, Prisma et PostgreSQL.

## ✨ Fonctionnalités

### 🛍️ E-commerce
- **Catalogue de produits** avec filtres avancés et recherche
- **Gestion des stocks** en temps réel avec tailles et catégories
- **Panier intelligent** avec réservation de stock
- **Processus de commande** complet avec paiement fictif
- **Gestion des commandes** avec suivi des statuts

### 👥 Gestion des utilisateurs
- **Système d'authentification** avec NextAuth.js
- **Trois rôles** : Administrateur, Vendeur, Client
- **Interfaces adaptées** selon les permissions
- **Gestion des profils** et adresses

### 🏪 Administration
- **Tableau de bord** avec statistiques en temps réel
- **Gestion des produits** (CRUD complet)
- **Gestion des stocks** avec alertes de rupture
- **Suivi des commandes** et gestion des statuts
- **Gestion des utilisateurs** et rôles

### 🔒 Sécurité
- **Validation stricte** des données avec Zod
- **Sanitization** des entrées utilisateur
- **Rate limiting** et protection contre les attaques
- **Headers de sécurité** complets
- **Chiffrement** des données sensibles

### 📱 RGPD & Conformité
- **Bannière de cookies** granulaire
- **Politique de confidentialité** complète
- **Gestion des consentements** par finalité
- **Droits des utilisateurs** (accès, rectification, effacement)
- **Sécurisation** des données personnelles

## 🚀 Technologies

### Frontend
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Radix UI** pour les composants
- **React Hook Form** pour les formulaires
- **Zustand** pour la gestion d'état

### Backend
- **Next.js API Routes** pour l'API REST
- **Prisma ORM** pour la base de données
- **NextAuth.js** pour l'authentification
- **Zod** pour la validation
- **bcryptjs** pour le hachage des mots de passe

### Base de données
- **PostgreSQL** hébergé sur Railway
- **Schéma complet** avec relations optimisées
- **Migrations** automatiques avec Prisma

### Sécurité
- **Helmet.js** pour les headers de sécurité
- **Rate limiting** avec express-rate-limit
- **Validation** côté serveur et client
- **Sanitization** des entrées
- **CSRF protection**

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Railway (pour la base de données)

### 1. Cloner le projet
```bash
git clone <repository-url>
cd sneakers-ecommerce
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
Créer un fichier `.env.local` :
```env
# Base de données Railway
DATABASE_URL="postgresql://postgres:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-super-securise"

# Stripe (optionnel pour paiement fictif)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Configuration de sécurité
BCRYPT_ROUNDS=12
JWT_SECRET="votre-jwt-secret"
SESSION_TIMEOUT=3600000
```

### 4. Configuration de la base de données
```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Peupler la base de données
npm run db:seed
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 👤 Comptes de test

Après le seeding, vous pouvez utiliser ces comptes :

### 👑 Administrateur
- **Email** : admin@sneakersstore.fr
- **Mot de passe** : password123
- **Accès** : Toutes les fonctionnalités

### 👨‍💼 Vendeur
- **Email** : vendeur@sneakersstore.fr
- **Mot de passe** : password123
- **Accès** : Gestion des produits et commandes

### 👤 Client
- **Email** : client@sneakersstore.fr
- **Mot de passe** : password123
- **Accès** : Achat et gestion du compte

## 🏗️ Architecture

### Structure des dossiers
```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── admin/             # Interface d'administration
│   ├── auth/              # Pages d'authentification
│   ├── products/          # Pages produits
│   └── api/               # Routes API
├── components/            # Composants React
│   ├── ui/               # Composants UI de base
│   ├── admin/            # Composants d'administration
│   └── checkout/         # Composants de commande
├── lib/                  # Utilitaires et configuration
├── store/                # Gestion d'état (Zustand)
└── types/                # Types TypeScript
```

### Base de données
Le schéma Prisma inclut :
- **Users** : Utilisateurs avec rôles
- **Products** : Catalogue de produits
- **StockItems** : Gestion des stocks par taille
- **Orders** : Commandes et statuts
- **OrderItems** : Détails des commandes
- **Addresses** : Adresses de livraison
- **Reviews** : Avis clients
- **CookieConsent** : Gestion RGPD

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run start           # Serveur de production
npm run lint            # Linting ESLint

# Base de données
npm run db:generate     # Générer le client Prisma
npm run db:push         # Appliquer les migrations
npm run db:migrate      # Créer une nouvelle migration
npm run db:studio       # Interface Prisma Studio
npm run db:seed         # Peupler la base de données
```

## 🚀 Déploiement

### Railway (Recommandé)
1. Connecter votre repository GitHub à Railway
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Vercel
1. Connecter votre repository à Vercel
2. Configurer les variables d'environnement
3. Déployer

### Docker
```bash
# Build de l'image
docker build -t sneakers-store .

# Lancement du conteneur
docker run -p 3000:3000 sneakers-store
```

## 📊 Fonctionnalités avancées

### Gestion des stocks
- **Réservation automatique** lors de l'ajout au panier
- **Alertes de rupture** de stock
- **Gestion par taille** et catégorie
- **Mise à jour en temps réel**

### Processus de commande
- **Étapes multiples** : Livraison → Paiement → Confirmation
- **Validation stricte** des données
- **Paiement fictif** sécurisé
- **Email de confirmation** (simulé)

### Interface d'administration
- **Tableau de bord** avec métriques
- **Gestion des produits** avec upload d'images
- **Suivi des commandes** en temps réel
- **Gestion des utilisateurs** et rôles

### Conformité RGPD
- **Bannière de cookies** granulaire
- **Gestion des consentements** par finalité
- **Droits des utilisateurs** complets
- **Politique de confidentialité** détaillée

## 🛡️ Sécurité

### Mesures implémentées
- **Validation** stricte des entrées
- **Sanitization** des données
- **Rate limiting** par IP
- **Headers de sécurité** complets
- **Protection CSRF**
- **Chiffrement** des données sensibles
- **Authentification** robuste

### Bonnes pratiques
- **Principe du moindre privilège**
- **Validation côté serveur** obligatoire
- **Logging** des événements de sécurité
- **Détection** d'activité suspecte

## 📈 Performance

### Optimisations
- **Images optimisées** avec Next.js Image
- **Lazy loading** des composants
- **Cache** des requêtes API
- **Compression** des assets
- **CDN** pour les images

### Monitoring
- **Métriques** de performance
- **Logs** structurés
- **Alertes** automatiques
- **Monitoring** 24/7

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- **Email** : contact@sneakersstore.fr
- **Issues** : Utiliser le système d'issues GitHub
- **Documentation** : Consulter la documentation du code

---

**Développé avec ❤️ pour un e-commerce moderne et sécurisé**
