#!/bin/bash

set -e

echo "=============================="
echo " Installing Xray Panel"
echo "=============================="


APP_DIR="/opt/xray-panel"



echo "[1/8] Updating system..."

apt update -y
apt upgrade -y



echo "[2/8] Installing packages..."

apt install -y \
python3 \
python3-pip \
python3-venv \
git \
curl \
nginx



echo "[3/8] Installing NodeJS..."


curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

apt install -y nodejs



echo "Node:"
node -v

echo "Python:"
python3 --version




echo "[4/8] Download project..."



if [ -d "$APP_DIR" ]

then

cd $APP_DIR

git pull


else

git clone https://github.com/hoomanyyy/xray-v2ray-panel.git $APP_DIR

fi



echo "[5/8] Backend setup..."



cd $APP_DIR/backend



python3 -m venv venv


source venv/bin/activate



pip install --upgrade pip


pip install -r requirements.txt



deactivate




echo "[6/8] Creating Backend Service..."



cat > /etc/systemd/system/xray-panel.service <<EOF

[Unit]
Description=Xray Panel Backend
After=network.target


[Service]

WorkingDirectory=$APP_DIR/backend

ExecStart=$APP_DIR/backend/venv/bin/python3 app.py

Restart=always

User=root


[Install]

WantedBy=multi-user.target

EOF




systemctl daemon-reload


systemctl enable xray-panel

systemctl restart xray-panel






echo "[7/8] Frontend build..."



cd $APP_DIR/frontend


npm install


npm run build





echo "[8/8] Nginx setup..."



cat > /etc/nginx/sites-available/xray-panel <<EOF


server {


listen 80;


server_name _;



root $APP_DIR/frontend/dist;

index index.html;



location / {


try_files \$uri /index.html;


}



location /api/ {


proxy_pass http://127.0.0.1:8000;


proxy_http_version 1.1;


proxy_set_header Host \$host;


proxy_set_header X-Real-IP \$remote_addr;


}


}


EOF




ln -sf /etc/nginx/sites-available/xray-panel \
/etc/nginx/sites-enabled/xray-panel



rm -f /etc/nginx/sites-enabled/default



nginx -t


systemctl restart nginx



echo ""
echo "=============================="
echo " Installation Finished"
echo "=============================="

echo ""

echo "Panel:"
echo "http://YOUR_SERVER_IP"


echo ""

echo "Backend:"
echo "systemctl status xray-panel"
