# React Form Project - Full Stack Application

[![Build and Test React App](https://github.com/varlopecar/react-form/actions/workflows/ci_cd.yml/badge.svg)](https://github.com/varlopecar/react-form/actions/workflows/ci_cd.yml)
[![codecov](https://codecov.io/gh/varlopecar/react-form/branch/main/graph/badge.svg)](https://app.codecov.io/gh/varlopecar/react-form)
[![npm version](https://badge.fury.io/js/@varlopecar%2Fci-cd.svg)](https://badge.fury.io/js/@varlopecar%2Fci-cd)

## 👥 Équipe de Développement

**Groupe de 2 étudiants :**

- **Varlopecar** - [GitHub: @varlopecar](https://github.com/varlopecar)
- **[Nom du deuxième étudiant]** - [GitHub: @username]

### 📋 Répartition des Tâches

| Tâche                                             | Responsable | Statut     |
| ------------------------------------------------- | ----------- | ---------- |
| Architecture Docker (MongoDB/Node.js)             | Varlopecar  | ✅ Terminé |
| Architecture Docker (MySQL/Python/React/Adminer)  | Varlopecar  | ✅ Terminé |
| Frontend React avec formulaire et base de données | Varlopecar  | ✅ Terminé |
| API Node.js avec MongoDB pour les posts           | Varlopecar  | ✅ Terminé |
| Gestion des utilisateurs avec rôles admin         | Varlopecar  | ✅ Terminé |
| Menu latéral et navigation                        | Varlopecar  | ✅ Terminé |
| Tests unitaires, intégration et E2E               | Varlopecar  | ✅ Terminé |
| Configuration Terraform (Docker)                  | Varlopecar  | ✅ Terminé |
| Configuration Terraform (Scalingo)                | Varlopecar  | ✅ Terminé |
| Pipelines GitHub Actions                          | Varlopecar  | ✅ Terminé |
| Documentation complète                            | Varlopecar  | ✅ Terminé |

## 🏗️ Architecture

Ce projet implémente une architecture dual API :

1. **Python FastAPI + MySQL** : Gestion des utilisateurs et authentification
2. **Node.js + MongoDB** : Posts de blog et gestion de contenu
3. **React Frontend** : Interface utilisateur avec Material-UI et menu latéral

## ✨ Fonctionnalités

### Gestion des Utilisateurs (Python FastAPI + MySQL)

- **Inscription Utilisateur** : Validation complète avec schémas Zod
- **Authentification** : Connexion/déconnexion avec tokens JWT
- **Gestion des Utilisateurs** :
  - Affichage de la liste des utilisateurs avec informations réduites
  - Les admins peuvent voir les informations privées des utilisateurs
  - Les admins peuvent supprimer les utilisateurs non-admin
  - Contrôle d'accès basé sur les rôles

### Système de Blog (Node.js + MongoDB)

- **Posts de Blog** : Affichage des posts sur la page d'accueil
- **Gestion de Contenu** : Création, lecture, modification et suppression de posts
- **Mise à jour en temps réel** : Chargement dynamique du contenu

### Frontend

- **Menu Latéral** : Navigation complète avec sidebar responsive
- **Validation de Formulaire** : Validation complète avec schémas Zod
- **Expérience Utilisateur** :
  - Bouton de soumission désactivé jusqu'à ce que tous les champs soient remplis
  - Messages d'erreur affichés sous chaque champ invalide
  - Notifications toast pour succès et échec
  - Design responsive avec Material-UI
- **Navigation** : Menu latéral avec éléments basés sur les rôles
- **Règles de Validation** :
  - Vérification de l'âge (18+ ans)
  - Format de code postal français
  - Validation des noms (permettant accents, tirets, espaces)
  - Validation d'email
- **Tests** : Couverture de tests complète avec tests unitaires et d'intégration
- **Documentation** : Documentation auto-générée avec JSDoc
- **Pipeline CI/CD** : Processus automatisé de build, test et déploiement

## 🚀 Démo en Ligne

Visitez la démo en ligne : [https://varlopecar.github.io/react-form/](https://varlopecar.github.io/react-form/)

## 🔧 Variables d'Environnement

Créez un fichier `.env` dans le répertoire racine :

```bash
# API de Gestion des Utilisateurs (Python FastAPI)
VITE_API_URL=http://localhost:8000

# API de Blog (Node.js)
VITE_BLOG_API_URL=http://localhost:3001

# Environnement
NODE_ENV=development
```

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/varlopecar/react-form.git

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev

# Lancer les tests
pnpm test

# Générer le rapport de couverture
pnpm coverage

# Générer la documentation
pnpm doc

# Build pour la production
pnpm build
```

## 🐳 Configuration Docker

### API de Gestion des Utilisateurs (Python FastAPI + MySQL)

```bash
# Démarrer les services de gestion des utilisateurs
cd backend
docker-compose up -d

# Cela démarrera :
# - Base de données MySQL
# - Backend FastAPI
# - Adminer (gestion de base de données)
```

### API de Blog (Node.js + MongoDB)

```bash
# Démarrer l'API de blog (repository séparé)
cd ../express-mongodb-app
docker-compose up -d

# Cela démarrera :
# - Base de données MongoDB
# - Serveur API Node.js
```

### Architecture Docker Complète

```bash
# Démarrer toute l'architecture avec Terraform
cd ../terraform-architecture
terraform init
terraform plan -var="environment=docker"
terraform apply -var="environment=docker"
```

## 🌐 Déploiement Scalingo

```bash
# Déployer sur Scalingo avec Terraform
cd ../terraform-architecture
terraform init
terraform plan -var="environment=scalingo" -var="scalingo_token=VOTRE_TOKEN"
terraform apply -var="environment=scalingo" -var="scalingo_token=VOTRE_TOKEN"
```

## 📡 Endpoints API

### API de Gestion des Utilisateurs (Python FastAPI)

- `POST /register` - Inscription utilisateur
- `POST /login` - Authentification utilisateur
- `GET /users` - Obtenir tous les utilisateurs (admin seulement)
- `DELETE /users/{id}` - Supprimer un utilisateur (admin seulement)
- `GET /me` - Obtenir les informations de l'utilisateur actuel

### API de Blog (Node.js)

- `GET /posts` - Obtenir tous les posts de blog
- `POST /posts` - Créer un nouveau post de blog
- `PUT /posts/{id}` - Modifier un post de blog
- `DELETE /posts/{id}` - Supprimer un post de blog

## 👤 Rôles Utilisateurs

### Utilisateurs Réguliers

- Peuvent s'inscrire et se connecter
- Peuvent voir la page d'accueil avec les posts de blog
- Peuvent voir la liste des utilisateurs avec informations réduites (nom, email, statut admin seulement)

### Utilisateurs Admin

- Toutes les permissions des utilisateurs réguliers
- Peuvent voir les informations complètes des utilisateurs (y compris les données privées)
- Peuvent supprimer les utilisateurs non-admin
- Peuvent gérer les posts de blog (créer, modifier, supprimer)

## 🧪 Tests

### Tests Unitaires

```bash
# Lancer les tests unitaires
pnpm test:unit

# Lancer les tests avec interface graphique
pnpm test:ui

# Générer la couverture de code
pnpm coverage
```

### Tests d'Intégration

```bash
# Lancer les tests d'intégration
pnpm test:integration
```

### Tests End-to-End

```bash
# Lancer les tests E2E avec Cypress
pnpm e2e

# Ouvrir Cypress en mode interactif
pnpm cypress:open
```

## 🔄 Pipeline CI/CD

Ce projet utilise GitHub Actions pour l'intégration et le déploiement continus :

1. **Build et Test** : S'exécute sur chaque push et pull request

   - Installe les dépendances
   - Lance les tests avec couverture
   - Génère la documentation
   - Build le projet

2. **Déploiement GitHub Pages** : Déploie le site de démo

   - Build le projet
   - Déploie sur GitHub Pages

3. **Intégration Docker** :

   - Build et teste les conteneurs Docker
   - Lance les tests d'intégration

4. **Déploiement Terraform** :

   - Configure l'environnement Docker
   - Déploie sur Scalingo

5. **Tests de Sécurité** :
   - Scan de vulnérabilités avec Trivy
   - Tests de performance avec Lighthouse

## 📁 Structure du Projet

```
react-form/
├── src/
│   ├── components/          # Composants React
│   │   ├── Sidebar.tsx     # Menu latéral
│   │   └── Navigation.tsx  # Navigation principale
│   ├── pages/              # Composants de pages
│   │   ├── HomePage.tsx    # Page d'accueil avec blog
│   │   ├── PostsPage.tsx   # Gestion des posts
│   │   ├── UsersPage.tsx   # Gestion des utilisateurs
│   │   └── DashboardPage.tsx
│   ├── services/           # Services API
│   ├── schemas/            # Schémas de validation
│   └── tests/              # Fichiers de test
├── backend/                # Backend Python FastAPI
│   ├── main.py            # Application FastAPI
│   ├── models.py          # Modèles de base de données
│   ├── schemas.py         # Schémas Pydantic
│   └── docker-compose.yml # Configuration Docker
├── cypress/               # Tests E2E
├── scripts/               # Scripts de build et déploiement
└── docs/                  # Documentation
```

## 📚 Documentation

La documentation est disponible directement depuis l'application en cliquant sur le lien "Documentation", ou vous pouvez y accéder à :
[https://varlopecar.github.io/react-form/docs/](https://varlopecar.github.io/react-form/docs/)

## 🔐 Sécurité

- Authentification JWT sécurisée
- Validation des données côté client et serveur
- Contrôle d'accès basé sur les rôles
- Scan de vulnérabilités automatisé
- Variables d'environnement sécurisées

## 📊 Métriques

- **Couverture de Tests** : >90%
- **Temps de Build** : <5 minutes
- **Temps de Déploiement** : <10 minutes
- **Performance Lighthouse** : >90/100

## 🤝 Contribution

1. Fork le repository
2. Créer une branche de fonctionnalité
3. Faire vos modifications
4. Ajouter des tests pour les nouvelles fonctionnalités
5. S'assurer que tous les tests passent
6. Soumettre une pull request

## 📞 Support

Pour des questions ou des problèmes :

- **GitHub Issues** : [https://github.com/varlopecar/react-form/issues](https://github.com/varlopecar/react-form/issues)
- **Email** : [votre-email@example.com]

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Material-UI** pour les composants d'interface
- **FastAPI** pour le backend Python
- **Express.js** pour l'API Node.js
- **Cypress** pour les tests E2E
- **Terraform** pour l'infrastructure as code
- **GitHub Actions** pour l'automatisation CI/CD

---

**Développé avec ❤️ par l'équipe de développement**
