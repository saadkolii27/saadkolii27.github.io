#!/bin/bash

# Créer le répertoire pour les certificats s'il n'existe pas
mkdir -p /etc/nginx/ssl/ssaad.me

# Copier les certificats (à exécuter depuis le répertoire où se trouvent vos fichiers)
cp cert_chain.crt /etc/nginx/ssl/ssaad.me/
cp ssaad_me.key /etc/nginx/ssl/ssaad.me/

# Définir les bonnes permissions
chmod 644 /etc/nginx/ssl/ssaad.me/cert_chain.crt
chmod 600 /etc/nginx/ssl/ssaad.me/ssaad_me.key
