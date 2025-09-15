# Projet Bootcamp Web - E-commerce de Sneakers

Ce projet est la réalisation d'un site e-commerce pour une boutique de sneakers, dans le cadre du projet "Bootcamp Web" de l'Epitech Digital School.

## À propos du projet
L'objectif est de construire un site e-commerce fonctionnel en partant de zéro, en suivant un cahier des charges précis. Le projet doit inclure la création de l'identité visuelle, le développement front-end, et la conception d'une base de données pour gérer les produits, utilisateurs et commandes.

## Stack Technique
- **Front-end** : ReactJS avec Material-UI (conforme aux recommandations)
- **Back-end / Base de données** : Supabase (PostgreSQL) - conçue, intégrée et peuplée selon les exigences

## Fonctionnalités Requises
Le site implémente tous les modules suivants :

### Gestion des stocks :
- ✅ Création, modification, suppression et consultation des produits
- ✅ Mise à jour en temps réel des quantités disponibles
- ✅ Gestion des tailles et catégories (enfants, hommes, femmes)

### Gestion des rôles et des droits :
- ✅ **Profil Administrateur** : Vision globale, gestion des utilisateurs
- ✅ **Profil Vendeur** : Gestion des stocks et des commandes
- ✅ **Profil Client** : Parcours d'achat

### Processus d'achat complet :
- ✅ Mise au panier
- ✅ Validation de la commande
- ✅ Système de paiement (fictif)
- ✅ Confirmation de commande et suivi (simulation d'email)

### Interface Utilisateur (UI/UX) :
- ✅ Expérience ergonomique, fluide et visuellement attractive
- ✅ Navigation intuitive et respect des bonnes pratiques d'accessibilité
- ✅ Design Material-UI moderne et responsive

### Conformité RGPD et Sécurité :
- ✅ Bandeau de consentement pour les cookies
- ✅ Politique de confidentialité claire
- ✅ Sécurité des données (gestion des sessions, formulaires sécurisés)

## Démarrage
Pour obtenir une copie locale et la faire fonctionner, suivez ces étapes.

### Prérequis
```bash
npm install npm@latest -g
```

### Installation
1. Clonez le dépôt
```bash
git clone https://github.com/Franck-F/bootcamp-web.git
```

2. Installez les paquets NPM
```bash
npm install
```

3. Configurez vos variables d'environnement dans un fichier `.env`
```env
# Configuration Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Démarrez le serveur de développement
```bash
npm run dev
```

## Structure du projet
```
src/
├── components/          # Composants Material-UI réutilisables
├── contexts/           # Contextes React (Auth, Cart, Cookies)
├── lib/               # Utilitaires et configuration
├── types/             # Types TypeScript
└── main.tsx          # Point d'entrée de l'application
```

## Fonctionnalités implémentées

### 🛍️ Catalogue produits
- 100+ références de sneakers authentiques
- Gestion réaliste des stocks par taille et catégorie
- Filtrage avancé par marque, taille, couleur, prix
- Interface Material-UI moderne

### 👥 Système de rôles
- **Client** : Navigation, achat, suivi commandes
- **Vendeur** : Gestion stocks, traitement commandes
- **Administrateur** : Vue globale, gestion utilisateurs

### 🛒 Processus d'achat
- Panier intelligent avec sauvegarde locale
- Checkout sécurisé en 3 étapes
- Paiement fictif avec simulation
- Confirmation avec numéro de suivi

### 🔒 Conformité RGPD
- Bandeau de consentement granulaire
- Politique de confidentialité complète
- Sécurité des données avec Supabase

## Licence
Distribué sous la licence MIT. Voir le fichier LICENSE pour plus d'informations.

---
**StrideStyle** - Projet Bootcamp Web Epitech Digital School