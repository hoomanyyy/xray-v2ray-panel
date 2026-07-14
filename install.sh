#!/bin/bash

set -e

echo "=================================="
echo " Installing Xray Panel"
echo "=================================="


APP_NAME="xray-panel"
APP_DIR="/opt/xray-panel"


echo "[1/9] Update system"

apt update -y


echo "[2/9] Install dependencies"

apt install -y \
git \
curl \
nginx \
python3 \
python3-pip \
python3-venv \
mysql-server


echo "[3/9] Install NodeJS"


curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

apt install -y nodejs


node -v
python3 --version



echo "[4/9] Clone project"


if [ -d "$APP_DIR" ]

then

echo "Project exists, updating..."

cd $APP_DIR

git pull


else

git clone https://github.com/hoomanyyy/xray-v2ray-panel.git $APP_DIR

fi



echo "[5/9] Setup backend"


cd $APP_DIR/backend


python3 -m venv venv


source venv/bin/activate


pip install --upgrade pip


pip install -r requirements.txt


deactivate




echo "[6/9] Create backend service"



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





echo "[7/9] Build frontend"



cd $APP_DIR/frontend


npm install


npm run build





echo "[8/9] Configure nginx"



cat > /etc/nginx/sites-available/xray-panel <<EOF


server {


listen 80;


server_name _;



root $APP_DIR/frontend/dist;


index index.html;



location / {


try_files \$uri \$uri/ /index.html;


}



location /api/ {


proxy_pass http://127.0.0.1:8000;


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





echo "[9/9] Finish"



echo ""
echo "=================================="
echo " Xray Panel Installed"
echo "=================================="

echo ""

echo "Frontend:"
echo "http://YOUR_SERVER_IP"


echo ""

echo "Backend status:"
echo "systemctl status xray-panel"
