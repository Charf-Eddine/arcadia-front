# Frontend du site "Arcadia"

## Description

Cette application est la partie frontend du site "**Arcadia**". Elle utilise les technologies JavaScript, HTML, SCSS et Bootstrap.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les prérequis suivants installés sur votre machine :

- Node.js

## Installation et Configuration

### Étape 1 : Cloner le projet

Clonez le projet sur votre machine locale.

### Étape 2 : Installation des dépendances

- Accédez au répertoire du projet.
- Exécutez la commande suivante pour installer les modules nécessaires :

```bash
$ npm install
```

### Étape 3 : Configurer l'URL du backend.

Ajuster la valeur de la constante "**apiUrl**" dans le fichier "**/js/script.js**" pour qu'elle pointe vers votre backend (par exemple : "http://localhost:3001")

```bash
const apiUrl = "http://localhost:3001";
```

## Démarrage de l'Application

Pour démarrer l'application, utilisez la commande suivante :

```bash
$ npm run start
```

Cela lancera le serveur de développement et l'application sera accessible à l'adresse suivante : http://localhost:3000
