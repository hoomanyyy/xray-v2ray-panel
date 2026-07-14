import pymysql
import os
from dotenv import load_dotenv

load_dotenv()


def connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )


def save_user(name, uuid, vless_link, server, port):
    con = connection()
    cur = con.cursor()

    cur.execute(
        """
        INSERT INTO users
        (username, uuid, vless_link, server, port)
        VALUES (%s,%s,%s,%s,%s)
        """,
        (name, uuid, vless_link, server, port)
    )

    con.commit()
    cur.close()
    con.close()


def getUsers():
    con = connection()
    cur = con.cursor()

    cur.execute("SELECT * FROM users")

    users = cur.fetchall()

    cur.close()
    con.close()

    return users


def deleteUser(user_id):
    con = connection()
    cur = con.cursor()

    cur.execute(
        "DELETE FROM users WHERE id=%s",
        (user_id,)
    )

    con.commit()

    cur.close()
    con.close()

    return {"Message": True}


def addInboundToDatabase(
    remark,
    protocol,
    network,
    port
):
    con = connection()
    cur = con.cursor()

    cur.execute(
        """
        INSERT INTO inbounds
        (remark,protocol,network,port)
        VALUES (%s,%s,%s,%s)
        """,
        (
            remark,
            protocol,
            network,
            port
        )
    )

    con.commit()

    cur.close()
    con.close()


def getInboundsFromDatabase():

    con = connection()
    cur = con.cursor()

    cur.execute("SELECT * FROM inbounds")

    rows = cur.fetchall()

    cur.close()
    con.close()

    return rows