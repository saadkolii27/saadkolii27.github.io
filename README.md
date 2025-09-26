# Serveur Proxy Appwrite

Ce serveur proxy permet de sécuriser les appels à l'API Appwrite en gardant votre clé API secrète côté serveur.

## Installation

1. Installez les dépendances :
```
cd server
npm install
```

2. Configurez le fichier `.env` avec vos informations Appwrite :
```
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=ssaad
APPWRITE_API_KEY=votre_nouvelle_clé_api_sécurisée
PORT=3000
```

3. Lancez le serveur :
```
npm start
```

Le serveur sera accessible à l'adresse `http://localhost:3000`.

## Points d'API

- `POST /api/register` : Créer un nouvel utilisateur
  - Corps de la requête : `{ "email": "...", "password": "...", "name": "..." }`
  - Réponse : `{ "success": true, "user": {...} }`

## Sécurité

- Ne partagez **JAMAIS** votre clé API dans des conversations, des commits Git ou des forums publics
- Si vous exposez accidentellement une clé API, révoquez-la immédiatement et générez-en une nouvelle
- Ne versionnez pas le fichier `.env` (assurez-vous qu'il est dans .gitignore)
- Utilisez HTTPS en production
- Ajoutez des règles CORS restrictives en production
- Stockez les clés API uniquement sur des serveurs sécurisés, jamais dans le code client
