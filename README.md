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

## Trivy
Le trivy-scan.yml est créé mais le projet étant ancien il y a beaucoup de faille (cf ci dessous pour Node.js). Le scan trivy n'est donc pas déployé.

Node.js (node-pkg)
==================
Total: 33 (HIGH: 32, CRITICAL: 1)

┌───────────────────────────────────────┬────────────────┬──────────┬──────────┬───────────────────┬────────────────────────────┬──────────────────────────────────────────────────────────────┐
│                Library                │ Vulnerability  │ Severity │  Status  │ Installed Version │       Fixed Version        │                         
   Title                             │
├───────────────────────────────────────┼────────────────┼──────────┼──────────┼───────────────────┼────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ ansi-regex (package.json)             │ CVE-2021-3807  │ HIGH     │ fixed    │ 3.0.0             │ 6.0.1, 5.0.1, 4.1.1, 3.0.1 │ nodejs-ansi-regex: Regular expression denial of service      │
│                                       │                │          │          │                   │                            │ (ReDoS) matching ANSI escape codes                           │
│                                       │                │          │          │                   │                            │ https://avd.aquasec.com/nvd/cve-2021-3807                    │
│                                       │                │          │          ├───────────────────┤                            │                         
...


## 🔧 Technologies utilisées
 - **📌 Gestion de version & CI/CD :** Git, GitHub Actions 
 - **📌 Containerisation :** Docker, Docker Compose 
 - **📌 Backend :** express node.js
 - **📌 Frontend :** react js
 - **📌 Base de données :** mongoDB


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/kycsoRcp)
