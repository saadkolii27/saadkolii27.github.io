#!/bin/bash

# Installation de Certbot et obtention d'un certificat SSL gratuit

# Mise à jour des paquets
apt update
apt install -y certbot python3-certbot-nginx

# Arrêt de NGINX pendant l'obtention du certificat
systemctl stop nginx

# Obtention du certificat avec Certbot (mode standalone)
certbot certonly --standalone -d ssaad.me -d www.ssaad.me

# Mise à jour de la configuration NGINX
cat > /etc/nginx/conf.d/ssaad_me.conf << 'EOL'
server {
    listen 80;
    server_name ssaad.me www.ssaad.me;
    
    # Redirection vers HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ssaad.me www.ssaad.me;
    
    root /var/www/ssaad.me;
    index index.html;
    
    # Certificats Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/ssaad.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ssaad.me/privkey.pem;
    
    ssl_session_timeout 5m;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    
    # Paramètres de sécurité supplémentaires
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    
    # Configuration pour servir les fichiers statiques
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Gestion des erreurs
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
EOL

# Redémarrage de NGINX
systemctl start nginx

# Configuration du renouvellement automatique
echo "0 3 * * * certbot renew --post-hook 'systemctl restart nginx'" > /etc/cron.d/certbot-renew
chmod 644 /etc/cron.d/certbot-renew

echo "Configuration SSL terminée avec succès !"
echo "Vérifiez votre site à https://ssaad.me"
