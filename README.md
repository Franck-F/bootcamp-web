# Projet Bootcamp Web - E-commerce de Sneakers

[![](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Ce projet est la réalisation d'un site e-commerce pour une boutique de sneakers, dans le cadre du projet "Bootcamp Web" de l'Epitech Digital School.

## À propos du projet
ttttt
L'objectif est de construire un site e-commerce fonctionnel en partant de zéro, en suivant un cahier des charges précis. Le projet doit inclure la création de l'identité visuelle, le développement front-end, et la conception d'une base de données pour gérer les produits, utilisateurs et commandes.

### Stack Technique

*   **Front-end :** Le langage est au choix, mais **ReactJS avec Material-UI** est recommandé.
*   **Back-end / Base de données :** Aucune base de données n'est fournie. Le développeur doit la **concevoir, l'intégrer et la peupler**.

## Fonctionnalités Requises

Le site doit implémenter les modules suivants :

1.  **Gestion des stocks :**
    *   Création, modification, suppression et consultation des produits.
    *   Mise à jour en temps réel des quantités disponibles.
    *   Gestion des tailles et catégories (enfants, hommes, femmes).

2.  **Gestion des rôles et des droits :**
    *   Profil **Administrateur** : Vision globale, gestion des utilisateurs.
    *   Profil **Vendeur** : Gestion des stocks et des commandes.
    *   Profil **Client** : Parcours d'achat.

3.  **Processus d'achat complet :**
    *   Mise au panier.
    *   Validation de la commande.
    *   Système de paiement (fictif).
    *   Confirmation de commande et suivi (simulation d'email).

4.  **Interface Utilisateur (UI/UX) :**
    *   Expérience ergonomique, fluide et visuellement attractive.
    *   Navigation intuitive et respect des bonnes pratiques d'accessibilité.

5.  **Conformité RGPD et Sécurité :**
    *   Bandeau de consentement pour les cookies.
    *   Politique de confidentialité claire.
    *   Sécurité des données (gestion des sessions, formulaires sécurisés).

## Démarrage

Pour obtenir une copie locale et la faire fonctionner, suivez ces étapes.

### Prérequis

*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clonez le dépôt
    ```sh
    git clone https://github.com/Franck-F/bootcamp-web.git
    ```
2.  Installez les paquets NPM
    ```sh
    npm install
    ```
3.  Configurez vos variables d'environnement dans un fichier `.env`
    ```
    # Exemple
    DB_HOST = 'localhost'
    DB_USER = 'root'
    DB_PASS = 'password'
    ```

## Licence

Distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

Lien du projet : [https://github.com/Franck-F/bootcamp-web](https://github.com/Franck-F/bootcamp-web)
