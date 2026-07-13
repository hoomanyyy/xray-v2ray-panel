from fastapi import FastAPI
from cores.xray import generate_user
from database.mysql import save_user
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database.mysql import getUsers
from database.mysql import deleteUser


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/createUser")
def create_user(data: dict):

    username = data["username"]
    server = data["server"]
    port = data["port"]


    user = generate_user(
        username,
        server,
        port
    )


    print(user)


    save_user(
        user["username"],
        user["uuid"],
        user["vless_link"],
        user["server"],
        user["port"]
    )


    return {
        "user": user,
        "Message": True
    }


@app.post("/api/getUsers")
def getUsersData():
    
    users = getUsers()

    return {
        "Message": True,
        "users": users
    }


@app.post("/api/deleteUser")
def deleteUserFromDb(data: dict):

    id = data["user_id"]

    result = deleteUser(id)

    return result


if __name__ == "__main__":

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )