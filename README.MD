# 🎓 PFE Tracker - Backend API   

Système de gestion des projets de fin d'études avec suivi Jira-like
AVANT LA SEANCE DU 10/10/2025
## 🚀 Statut du Projet   
**Phase 1 :** ✅ Squelette d'authentification terminé  
**Phase 2 :** 🚧 Développement des fonctionnalités en cours

## 👥 Équipes et Responsabilités

### Équipe A - Projets & Sprints
- **Membres:** [À compléter]
- **Modèles:** Project, Sprint
- **Routes:** `/api/projects`, `/api/sprints`
- **Branche:** `feat/equipe-A-projets-sprints`

### Équipe B - User Stories & Rapports
- **Membres:** [À compléter]
- **Modèles:** UserStory, Report
- **Routes:** `/api/user-stories`, `/api/reports`
- **Branche:** `feat/equipe-B-userstories-rapports`

### Équipe C - Tâches & Workflow
- **Membres:** [À compléter]
- **Modèles:** Task, TaskHistory
- **Routes:** `/api/tasks`
- **Branche:** `feat/equipe-C-taches-workflow`

### Équipe D - Validations & Réunions
- **Membres:** [À compléter]
- **Modèles:** Validation, Meeting
- **Routes:** `/api/validations`, `/api/meetings`
- **Branche:** `feat/equipe-D-validations-reunions`

## 📋 Fonctionnalités Implémentées

### ✅ Phase 1 - Terminée
- 🔐 Authentification JWT avec 3 rôles
- 🗄️ Connexion MongoDB Atlas
- 🛡️ Middleware de sécurité
- 📡 API REST structurée

### 🚧 Phase 2 - En Développement
- 📁 Gestion des projets et sprints
- 📝 User stories et rapports
- ✅ Tâches et workflow
- 👥 Validations et réunions

## 🛠️ Installation et Démarrage

```bash
# Cloner le projet
git clone https://github.com/maaliKachroudi24/pfe-tracker.git
cd pfe-tracker

# Installer les dépendances
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos configurations

# Démarrer en développement
npm run dev
