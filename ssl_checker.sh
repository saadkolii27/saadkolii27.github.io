#!/bin/bash

# Script de vérification SSL pour votre serveur

echo "Vérification de la configuration SSL pour ssaad.me"
echo "=================================================="

# 1. Vérifier si le certificat est valide pour votre domaine
echo -e "\n1. Validation du certificat :"
openssl x509 -in /etc/nginx/ssl/ssaad.me/cert_chain.crt -text -noout | grep -A1 "Subject:"
openssl x509 -in /etc/nginx/ssl/ssaad.me/cert_chain.crt -text -noout | grep -A1 "DNS:"

# 2. Vérifier la correspondance entre le certificat et la clé privée
echo -e "\n2. Vérification de la correspondance certificat/clé privée :"
CERT_MD5=$(openssl x509 -noout -modulus -in /etc/nginx/ssl/ssaad.me/cert_chain.crt | openssl md5)
KEY_MD5=$(openssl rsa -noout -modulus -in /etc/nginx/ssl/ssaad.me/ssaad_me.key | openssl md5)
echo "Certificat MD5: $CERT_MD5"
echo "Clé privée MD5: $KEY_MD5"
if [ "$CERT_MD5" = "$KEY_MD5" ]; then
    echo "✓ Le certificat et la clé privée correspondent"
else
    echo "✗ ERREUR: Le certificat et la clé privée NE correspondent PAS!"
fi

# 3. Vérifier la configuration de nginx
echo -e "\n3. Vérification de la configuration NGINX :"
nginx -t

# 4. Vérifier les redirections HTTP vers HTTPS
echo -e "\n4. Test de redirection HTTP vers HTTPS :"
curl -I -L http://ssaad.me

# 5. Vérifier les protocoles SSL supportés
echo -e "\n5. Protocoles SSL supportés :"
PROTOCOLS=$(grep -r "ssl_protocols" /etc/nginx/conf.d/)
echo "$PROTOCOLS"

echo -e "\nPour un diagnostic complet, utilisez : https://www.ssllabs.com/ssltest/analyze.html?d=ssaad.me"
