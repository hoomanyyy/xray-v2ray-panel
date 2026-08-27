import uuid
import urllib.parse
import os
import json

XRAY_CONFIG = "/etc/xray/config.json"


def generate_uuid():
    return str(uuid.uuid4())


def restart_xray():
    os.system("systemctl restart xray")


def load_config():
    if not os.path.exists(XRAY_CONFIG):
        return {
            "log": {"loglevel": "warning"},
            "inbounds": [],
            "outbounds": [{"protocol": "freedom", "tag": "direct"}]
        }
    with open(XRAY_CONFIG, "r") as f:
        return json.load(f)


def save_config(config):
    os.makedirs(os.path.dirname(XRAY_CONFIG), exist_ok=True)
    with open(XRAY_CONFIG, "w") as f:
        json.dump(config, f, indent=4)


def get_reality_config():
    config = load_config()
    for inbound in config.get("inbounds", []):
        stream = inbound.get("streamSettings", {})
        if stream.get("security") == "reality":
            reality = stream.get("realitySettings", {})
            short_ids = reality.get("shortIds", [])
            server_names = reality.get("serverNames", [])
            return {
                "public_key": reality.get("publicKey", ""),
                "short_id": short_ids[0] if short_ids else "",
                "sni": server_names[0] if server_names else "www.cloudflare.com",
                "port": inbound.get("port")
            }
    return None


def add_xray_config(email, user_uuid):
    config = load_config()
    for inbound in config.get("inbounds", []):
        stream = inbound.get("streamSettings", {})
        if stream.get("security") == "reality" or inbound.get("protocol") == "vless":
            clients = inbound.setdefault("settings", {}).setdefault("clients", [])
            clients.append({"id": user_uuid, "email": email})
            break
    save_config(config)
    restart_xray()


def addInboundToXray(protocol, port, network, security="reality", tag="inbound"):
    config = load_config()

    inbound = {
        "tag": tag,
        "port": int(port),
        "protocol": protocol,
        "settings": {
            "clients": [],
            "decryption": "none"
        },
        "streamSettings": {
            "network": network,
            "security": security
        }
    }

    config.setdefault("inbounds", []).append(inbound)
    save_config(config)
    restart_xray()
    return True


def generate_user(username, server, port):
    user_uuid = generate_uuid()
    reality = get_reality_config()

    remark = urllib.parse.quote(username)

    if reality and reality.get("public_key"):
        link = (
            f"vless://{user_uuid}@{server}:{port}"
            f"?type=tcp&security=reality&encryption=none"
            f"&pbk={reality['public_key']}"
            f"&fp=chrome&sni={reality['sni']}&sid={reality['short_id']}"
            f"#{remark}"
        )
    else:
        link = (
            f"vless://{user_uuid}@{server}:{port}"
            f"?type=tcp&security=none&encryption=none"
            f"#{remark}"
        )

    add_xray_config(username, user_uuid)

    return {
        "username": username,
        "uuid": user_uuid,
        "vless_link": link,
        "server": server,
        "port": port
    }
