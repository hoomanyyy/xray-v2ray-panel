#!/bin/bash

set -e

echo "================================"
echo " Installing Hooman XRay Panel "
echo "================================"


apt update -y


echo "[1/8] Installing packages..."

apt install -y \
git \
python3 \
python3-pip \
python3-venv \
mysql-server \
nginx \
curl \
nodejs \
npm



echo "[2/8] Setting MySQL..."


systemctl start mysql
systemctl enable mysql


DB_NAME="xray_panel"
DB_USER="panel"
DB_PASSWORD="panel_password"


mysql <<EOF

CREATE DATABASE IF NOT EXISTS $DB_NAME;

CREATE USER IF NOT EXISTS '$DB_USER'@'localhost'
IDENTIFIED BY '$DB_PASSWORD';

GRANT ALL PRIVILEGES ON $DB_NAME.*
TO '$DB_USER'@'localhost';

FLUSH PRIVILEGES;


USE $DB_NAME;


CREATE TABLE IF NOT EXISTS users (

id INT AUTO_INCREMENT PRIMARY KEY,

username VARCHAR(100) NOT NULL,

uuid VARCHAR(100) NOT NULL,

vless_link TEXT NOT NULL,

server VARCHAR(255),

port INT

);

EOF



echo "[3/8] Download project..."


cd /opt


if [ ! -d "xray-v2ray-panel" ]; then

git clone https://github.com/hoomanyyy/xray-v2ray-panel.git

fi


cd xray-v2ray-panel



echo "[4/8] Backend setup..."


cd backend


python3 -m venv venv


source venv/bin/activate


pip install --upgrade pip

pip install -r requirements.txt


cat > .env <<EOF

DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME


PUBLIC_KEY=YOUR_PUBLIC_KEY
SHORT_ID=YOUR_SHORT_ID
SNI=YOUR_SNI

EOF


deactivate


cd ..



echo "[5/8] Frontend setup..."


cd frontend


npm install

npm run build


rm -rf /var/www/html/*

cp -r build/* /var/www/html/


cd ..



echo "[6/8] Creating backend service..."


cat > /etc/systemd/system/xray-panel.service <<EOF

[Unit]

Description=Hooman XRay Panel Backend

After=network.target



[Service]

WorkingDirectory=/opt/xray-v2ray-panel/backend

ExecStart=/opt/xray-v2ray-panel/backend/venv/bin/python app.py

Restart=always



[Install]

WantedBy=multi-user.target

EOF



systemctl daemon-reload

systemctl enable xray-panel

systemctl restart xray-panel



echo "[7/8] Config nginx..."


cat > /etc/nginx/sites-available/xray-panel <<EOF


server {


listen 80;


server_name _;



root /var/www/html;


index index.html;



location / {


try_files \$uri /index.html;


}



location /api/ {


proxy_pass http://127.0.0.1:8000;


proxy_set_header Host \$host;


proxy_set_header X-Real-IP \$remote_addr;


}



}


EOF



rm -f /etc/nginx/sites-enabled/default


ln -s /etc/nginx/sites-available/xray-panel \
/etc/nginx/sites-enabled/xray-panel



nginx -t


systemctl restart nginx



echo "[8/8] Finished"


echo ""
echo "================================"
echo " Panel Installed Successfully "
echo "================================"

echo ""

echo "Open:"
echo "http://SERVER_IP"
