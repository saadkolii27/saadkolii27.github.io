#!/bin/bash

# Script de vérification de la connexion Appwrite
# Ce script vérifie les problèmes courants liés à "Failed to fetch"

echo "Diagnostic de connexion Appwrite pour ssaad.me"
echo "=============================================="

# Variables
APPWRITE_ENDPOINT="https://nyc.cloud.appwrite.io/v1"
APPWRITE_PROJECT_ID="ssaad"
YOUR_DOMAIN="https://www.ssaad.me"

# 1. Vérifier la disponibilité de l'endpoint Appwrite
echo -e "\n1. Test de disponibilité de l'endpoint Appwrite :"
if curl --output /dev/null --silent --head --fail "$APPWRITE_ENDPOINT"; then
    echo "✓ L'endpoint Appwrite est accessible"
else
    echo "✗ ERREUR: Impossible d'accéder à l'endpoint Appwrite!"
    echo "  Vérifiez l'URL: $APPWRITE_ENDPOINT"
fi

# 2. Vérifier les en-têtes CORS de l'API Appwrite
echo -e "\n2. Vérification des en-têtes CORS de l'API Appwrite :"
echo "Envoi d'une requête OPTIONS pour tester les en-têtes CORS..."
curl -s -I -X OPTIONS "$APPWRITE_ENDPOINT/health" \
     -H "Origin: $YOUR_DOMAIN" \
     -H "Access-Control-Request-Method: GET" | grep -i "access-control"

echo -e "\nSi aucun en-tête 'Access-Control' n'apparaît ci-dessus, cela signifie que CORS n'est pas configuré correctement."
echo "Vous devez ajouter votre domaine ($YOUR_DOMAIN) dans les paramètres CORS d'Appwrite."

# 3. Vérifier le problème de Mixed Content (HTTP/HTTPS)
echo -e "\n3. Vérification de la configuration SSL/HTTPS :"
if [[ "$YOUR_DOMAIN" == https://* ]] && [[ "$APPWRITE_ENDPOINT" == https://* ]]; then
    echo "✓ Les deux URLs utilisent HTTPS - Pas de problème de Mixed Content"
else
    echo "✗ ATTENTION: Problème potentiel de Mixed Content!"
    echo "  Votre domaine: $YOUR_DOMAIN"
    echo "  Endpoint Appwrite: $APPWRITE_ENDPOINT"
    echo "  Si l'un est en HTTP et l'autre en HTTPS, les navigateurs bloqueront les requêtes."
fi

# 4. Test de la requête avec curl complet
echo -e "\n4. Test de requête complète vers l'API Appwrite :"
echo "Résultat de la requête à l'API Health d'Appwrite :"
curl -s -X GET "$APPWRITE_ENDPOINT/health" \
     -H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" \
     -H "Origin: $YOUR_DOMAIN"

echo -e "\n\n5. Recommandations pour résoudre l'erreur 'Failed to fetch' :"
echo "  a. Dans la console Appwrite, allez dans 'Settings > Security'"
echo "  b. Ajoutez '$YOUR_DOMAIN' à la liste des domaines autorisés"
echo "  c. Assurez-vous que l'endpoint et votre site utilisent tous les deux HTTPS"
echo "  d. Si vous êtes en développement local, utilisez https://localhost avec un certificat SSL local"
echo "  e. Utilisez le serveur proxy que nous avons configuré pour éviter les problèmes CORS"

echo -e "\nPour plus de détails, visitez : https://appwrite.io/docs/authentication#cors"
