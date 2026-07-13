import uuid
import urllib.parse
import os
from dotenv import load_dotenv
import json


load_dotenv()

PUBLIC_KEY = os.getenv("PUBLIC_KEY")
SHORT_ID = os.getenv("SHORT_ID")
SNI = os.getenv("SNI")


def generate_uuid():
    return str(uuid.uuid4())


def add_xray_config(email , user_uuid):

    path = "/etc/xray/config.json"

    with open(path , "r") as f:
        config = json.dump(f)

    clients = config["inbounds"][0]["settings"]["clients"]

    clients.append({
        "id": user_uuid,
        "email": email
    })

def generate_user(username , server , port):

    user_uuid = generate_uuid()

    remark = urllib.parse.quote(username)

    vless_link = (
        f"vless://{user_uuid}@{server}:{port}"
        f"?type=tcp"
        f"&security=reality"
        f"&encryption=none"
        f"&pbk={PUBLIC_KEY}"
        f"&fp=chrome"
        f"&sni={SNI}"
        f"&sid={SHORT_ID}"
        f"&spx=%2F"
        f"#{remark}"
    )

    add_xray_config(username , user_uuid)

    print("vless_link:", vless_link)

    return {
        "username": username,
        "uuid": user_uuid,
        "vless_link": vless_link,
        "server": server,
        "port": port,
    }