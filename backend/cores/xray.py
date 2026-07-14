import uuid
import urllib.parse
import os
import json
import subprocess

XRAY_CONFIG = "/etc/xray/config.json"


def generate_uuid():
    return str(uuid.uuid4())



def restart_xray():
    os.system("systemctl restart xray")



def get_reality_config():

    with open(XRAY_CONFIG,"r") as f:
        config = json.load(f)


    for inbound in config.get("inbounds",[]):

        stream = inbound.get("streamSettings",{})


        if stream.get("security") == "reality":


            reality = stream.get(
                "realitySettings",
                {}
            )


            private_key = reality.get(
                "privateKey"
            )


            if not private_key:
                continue



            short_ids = reality.get(
                "shortIds",
                []
            )


            server_names = reality.get(
                "serverNames",
                []
            )



            # ساخت public key از private key

            result = subprocess.check_output(
                [
                    "xray",
                    "x25519",
                    "-i",
                    private_key
                ],
                text=True
            )


            public_key = None


            for line in result.splitlines():

                if "Public key:" in line:

                    public_key = (
                        line
                        .split(":")[1]
                        .strip()
                    )



            return {

                "public_key":public_key,

                "short_id":
                    short_ids[0]
                    if short_ids
                    else "",


                "sni":
                    server_names[0]
                    if server_names
                    else "www.cloudflare.com",


                "port":
                    inbound.get("port")

            }



    return None





def add_xray_config(email,user_uuid):


    with open(XRAY_CONFIG,"r") as f:
        config=json.load(f)



    for inbound in config["inbounds"]:


        if inbound["streamSettings"].get("security")=="reality":


            clients = (
                inbound
                .setdefault(
                    "settings",
                    {}
                )
                .setdefault(
                    "clients",
                    []
                )
            )


            clients.append({

                "id":user_uuid,

                "email":email

            })


            break




    with open(XRAY_CONFIG,"w") as f:

        json.dump(
            config,
            f,
            indent=4
        )


    restart_xray()







def generate_user(
    username,
    server,
    port
):


    user_uuid = generate_uuid()



    reality = get_reality_config()



    if not reality:

        raise Exception(
            "Reality inbound not found"
        )




    remark = urllib.parse.quote(
        username
    )



    link=(

        f"vless://{user_uuid}@{server}:{port}"

        f"?type=tcp"

        f"&security=reality"

        f"&encryption=none"

        f"&pbk={reality['public_key']}"

        f"&fp=chrome"

        f"&sni={reality['sni']}"

        f"&sid={reality['short_id']}"

        f"#{remark}"

    )




    add_xray_config(
        username,
        user_uuid
    )



    return {


        "username":username,

        "uuid":user_uuid,

        "vless_link":link,

        "server":server,

        "port":port

    }