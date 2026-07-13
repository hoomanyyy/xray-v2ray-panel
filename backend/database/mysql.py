import pymysql
import os
from dotenv import load_dotenv

load_dotenv()


def connection():

    con = pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

    print(
    os.getenv("DB_USER"),
    repr(os.getenv("DB_PASSWORD"))
)

    return con



def save_user(name, uuid, vless_link, server, port):

    con = connection()

    cursor = con.cursor()

    query = """
    INSERT INTO users
    (`username`, `uuid`, `vless_link`, `server`, `port`)
    VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(
        query,
        (
            name,
            uuid,
            vless_link,
            server,
            port
        )
    )

    con.commit()

    cursor.close()
    con.close()
    

    print("user saved")


def getUsers():

    con = connection()

    cursor = con.cursor()

    query = "SELECT * FROM users"

    cursor.execute(query)

    users = cursor.fetchall()

    cursor.close()
    con.close()

    print(f"users: {users}")

    return users


def deleteUser(user_id):

    con = connection()

    cursor = con.cursor()

    query = "DELETE FROM users WHERE id = %s"

    cursor.execute(
        query,
        (user_id,)
    )

    con.commit()

    cursor.close()
    con.close()

    return {
        "Message": True
    }