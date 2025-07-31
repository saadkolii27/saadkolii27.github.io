#!/bin/bash

# Script pour détecter les ressources mixtes (HTTP dans HTTPS)

echo "Recherche de contenu mixte dans votre site web"
echo "============================================="

# Chemin vers les fichiers HTML
SITE_ROOT="/var/www/ssaad.me"

# Recherche de liens HTTP
echo -e "\nRecherche de liens HTTP dans les fichiers HTML :"
grep -r "http://" --include="*.html" --include="*.js" "$SITE_ROOT" | grep -v "https://"

# Recherche d'images, scripts, css sans protocole spécifié
echo -e "\nRecherche de ressources sans protocole (//example.com) :"
grep -r "src=\"//" --include="*.html" --include="*.js" "$SITE_ROOT"
grep -r "href=\"//" --include="*.html" --include="*.css" "$SITE_ROOT"

echo -e "\nPour une vérification complète, utilisez les outils de développement Chrome :"
echo "1. Ouvrez votre site en HTTPS"
echo "2. Appuyez sur F12 pour ouvrir les outils développeur"
echo "3. Allez dans l'onglet Console et recherchez les avertissements 'Mixed Content'"
