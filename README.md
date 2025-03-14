
# Projet Final : Application Web Dockerisée avec CI/CD et Déploiement Cloud  

## Noms des membres du trinôme  
- Evan FERROND 
- Kevin CHAFFAUX 
- Lucas BIGOT 

## Description du projet 
 Ce projet vise à mettre en place une application complète en respectant les principes DevOps.

## Technologies utilisées 
 - **📌 Gestion de version & CI/CD :** Git, GitHub Actions 
 - **📌 Containerisation :** Docker, Docker Compose 
 - **📌 Backend :** Node.js avec Express
 - **📌 Frontend :** React.js
 - **📌 Base de données :** mongoDB

## Instructions de démarrage 

### Local:
    docker-compose up --build -d
    
### Adresses en local:
- **Prometheus**: http://localhost:9090/
- **Grafana**: http://localhost:3001/ (*login: admin, mdp: admin*)
- **Alertmanager**: http://localhost:9093/
- **Application**: http://localhost:7777/

### Adresse en production:
- [https://m3-devops-final-project-lek-production.up.railway.app/](https://m3-devops-final-project-lek-production.up.railway.app/ "https://m3-devops-final-project-lek-production.up.railway.app/")

## Livrables réalisés
### Must Have:
-   Création de Dockerfiles pour le frontend, le backend et la base de données.
-   Orchestration des services via Docker Compose.
- Utilisation de variables d'environnement (.env) pour les configurations sensibles.
-  Utilisation de branches Git et pull requests pour la gestion des modifications.
-   Répartition équitable des tâches entre les membres du trinôme.
### Should Have:
- Déclenchement automatique des builds et des déploiements sur chaque push vers la branche principale.
- Respect des conventions de commit pour faciliter l'automatisation et la lisibilité de l'historique Git.
- Optimisation de la taille des images Docker via des builds multi-étapes.
- Déploiement vers un environnement de production (sur Railway) via github Actions. Sur le fork : (https://github.com/evanferron/m3-devops-final-project-lek)
### Nice to Have:
-   Intégration d'un tableau de bord Grafana avec Prometheus pour visualiser les métriques applicatives.
-   Alerting automatisé en cas d'incident via Slack ou Discord.
- Scan automatique des images Docker avec Trivy ou Snyk dans le pipeline CI.
- Utilisation d'husky pour forcer la convention internationnale des commits

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/kycsoRcp)
