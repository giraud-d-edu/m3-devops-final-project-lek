# Projet Final : Application Web Dockerisée avec CI/CD et Déploiement Cloud  

## Noms des membres du trinôme  
- Evan FERROND 
- Kevin CHAFFAUX 
- Lucas BIGOT 

## Description du projet : 
 Ce projet vise à mettre en place une application complète en respectant les principes DevOps. Pour ce faire nous allons dockeriser le projet dev de fin d'année de B2.

## Instructions de démarrage  
### Prérequis  
- [Git](https://git-scm.com/) 
- [Docker & Docker Compose](https://www.docker.com/) 
-  *A mettre à jour*  

### Démarrage en local  

#### **Terminal 1 backend (WSL -  recommandé) :**  
1.  **Se rendre dans le dossier de l'API :**  ```cd Api ```  
2.  **Initialiser la base de données (si nécessaire) :**  ```go run main.go --init ```  
3.  **Lancer le backend :**  ```go run main.go ```  

#### **Terminal 2 (Bash recommandé):**  
1.  **Se rendre dans le dossier de l'application frontend :**  ```cd Application/ ```  
2.  **Installer les dépendances :**  ```npm i ```  
3.  **Lancer l'application en mode développement :**  ```npm run dev ```
4. **Ou build l'application:** ```npm run build```

> En mode build, se rendre dans le dossier : "*release/1.0.0*" et démarrer l'exécutable.

## 🔧 Technologies utilisées
 - **📌 Gestion de version & CI/CD :** Git, GitHub Actions 
 - **📌 Containerisation :** Docker, Docker Compose 
 - **📌 Backend :** Golang
 - **📌 Frontend :** Electron avec un template Vite + React.ts
 - **📌 Base de données :** SQLite


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/kycsoRcp)
