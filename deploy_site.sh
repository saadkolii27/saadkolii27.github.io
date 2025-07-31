#!/bin/bash

# Créer le répertoire du site
mkdir -p /var/www/ssaad.me

# Copier les fichiers du site
rsync -avz --delete /chemin/vers/votre/depot/local/saadkolii27.github.io/ /var/www/ssaad.me/
# OU si vous clonez directement de GitHub:
# git clone https://github.com/saadkolii27/saadkolii27.github.io.git /var/www/ssaad.me

# Définir les permissions
chown -R www-data:www-data /var/www/ssaad.me
chmod -R 755 /var/www/ssaad.me

# Installer la configuration NGINX
cp ssaad_me.conf /etc/nginx/conf.d/

# Tester la configuration NGINX
nginx -t

# Redémarrer NGINX si le test est réussi
systemctl restart nginx
