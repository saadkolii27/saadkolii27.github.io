#!/bin/bash

# Mise à jour du système
apt update
apt upgrade -y

# Installation de NGINX
apt install nginx -y

# Installation de Certbot pour Let's Encrypt (alternative si vous préférez des certificats automatiques)
apt install certbot python3-certbot-nginx -y

# Création du répertoire pour votre site
mkdir -p /var/www/ssaad.me
chown -R www-data:www-data /var/www/ssaad.me
chmod -R 755 /var/www/ssaad.me

# Création d'un répertoire pour vos certificats SSL personnalisés
mkdir -p /etc/nginx/ssl/ssaad.me
