# 🚀 SneakPeak - E-commerce de Sneakers Moderne

Un site e-commerce moderne et professionnel pour une boutique de sneakers, développé avec Next.js 14, TypeScript, et Prisma.

## ✨ Fonctionnalités

### 🛍️ **E-commerce Complet**
- **Catalogue de produits** avec filtres avancés (catégorie, marque, prix, taille)
- **Recherche intelligente** avec autocomplétion en temps réel
- **Pages dédiées** : Homme, Femme, Enfant, Nouveautés, Soldes
- **Panier moderne** avec gestion des variantes (taille, couleur)
- **Processus de commande** complet avec paiement fictif
- **Suivi des commandes** et historique

### 👥 **Gestion des Utilisateurs**
- **Authentification sécurisée** avec NextAuth.js
- **3 rôles** : Administrateur, Vendeur, Client
- **Profils utilisateurs** avec gestion des informations
- **Système de permissions** granulaire

### 📊 **Administration Avancée**
- **Backoffice moderne** pour la gestion des stocks
- **Tableau de bord** avec KPIs en temps réel
- **Gestion des produits** (CRUD complet)
- **Gestion des utilisateurs** et des commandes
- **Analytiques** et rapports de vente

### 🎨 **Interface Moderne**
- **Design sombre** et élégant
- **Responsive** sur tous les appareils
- **Animations fluides** et transitions
- **Thème clair/sombre** avec persistance
- **UX optimisée** avec feedback visuel

### 🔒 **Sécurité & Conformité**
- **Conformité RGPD** avec bannière de cookies
- **Pages légales** complètes (Confidentialité, CGV, etc.)
- **Validation des données** côté client et serveur
- **Protection CSRF** et sécurisation des sessions
- **Chiffrement des mots de passe** avec bcrypt

## 🛠️ **Stack Technique**

### **Frontend**
- **Next.js 14** (App Router)
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Radix UI** pour les composants
- **React Hook Form** + **Zod** pour les formulaires
- **Zustand** pour la gestion d'état

### **Backend**
- **Next.js API Routes** (REST API)
- **Prisma ORM** pour la base de données
- **NextAuth.js** pour l'authentification
- **PostgreSQL** (Railway) pour la base de données

### **Outils & Services**
- **Railway** pour l'hébergement de la base de données
- **Vercel** pour le déploiement
- **GitHub** pour le versioning

## 🚀 **Installation & Démarrage**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Compte Railway (pour la base de données)

### **1. Cloner le repository**
```bash
git clone https://github.com/Franck-F/bootcamp-web.git
cd bootcamp-web
```

### **2. Installer les dépendances**
```bash
npm install
```

### **3. Configuration de la base de données**
1. Créer un projet sur [Railway](https://railway.app)
2. Ajouter une base de données PostgreSQL
3. Copier les variables de connexion

### **4. Variables d'environnement**
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

### **5. Initialiser la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Peupler la base de données (optionnel)
npx prisma db seed
```

### **6. Démarrer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 **Structure du Projet**

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

## 🎯 **Fonctionnalités Clés**

### **Recherche Avancée**
- Autocomplétion en temps réel
- Recherche dans produits, marques, catégories
- Suggestions visuelles avec images et prix
- Navigation clavier et mobile-friendly

### **Gestion des Stocks**
- Suivi en temps réel des quantités
- Alertes de stock faible
- Gestion des variantes (taille, couleur)
- Import/Export de données

### **Processus d'Achat**
- Panier persistant
- Calcul automatique des taxes
- Paiement fictif sécurisé
- Confirmation par email (simulation)

## 🌐 **Déploiement sur Vercel**

### **1. Connecter le repository**
1. Aller sur [Vercel](https://vercel.com)
2. Importer le projet depuis GitHub
3. Sélectionner le repository `bootcamp-web`

### **2. Configuration des variables d'environnement**
Dans Vercel, ajouter les variables :
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### **3. Déploiement automatique**
Vercel déploiera automatiquement à chaque push sur la branche `main`.

## 📊 **Base de Données**

Le projet utilise Prisma avec PostgreSQL. Le schéma inclut :

- **Users** : Utilisateurs avec rôles
- **Products** : Produits avec variantes
- **Orders** : Commandes et détails
- **Categories** : Catégories de produits
- **Brands** : Marques
- **Variants** : Variantes de produits (taille, couleur)

## 🔧 **Scripts Disponibles**

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
npm run type-check   # Vérification TypeScript
```

## 📝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 **Auteur**

**Franck-F** - [GitHub](https://github.com/Franck-F)

## 🙏 **Remerciements**

- [Next.js](https://nextjs.org/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Prisma](https://prisma.io/) pour l'ORM
- [Railway](https://railway.app/) pour l'hébergement de la base de données
- [Vercel](https://vercel.com/) pour le déploiement

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a aidé !**