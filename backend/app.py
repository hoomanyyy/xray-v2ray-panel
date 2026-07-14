from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from cores.xray import (
    generate_user,
    addInboundToXray
)

from database.mysql import (
    save_user,
    getUsers,
    deleteUser,
    addInboundToDatabase,
    getInboundsFromDatabase
)

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

    user = generate_user(
        username=data["username"],
        server=data["server"],
        port=data["port"]
    )

    save_user(
        user["username"],
        user["uuid"],
        user["vless_link"],
        user["server"],
        user["port"]
    )

    return {
        "Message": True,
        "user": user
    }


@app.post("/api/getUsers")
def get_users():

    return {
        "Message": True,
        "users": getUsers()
    }


@app.post("/api/deleteUser")
def delete_user(data: dict):

    return deleteUser(data["user_id"])


@app.post("/api/addInbound")
def add_inbound(data: dict):

    addInboundToXray(
        protocol=data["protocol"],
        port=int(data["port"]),
        network=data["network"],
        security=data.get("security", "reality"),
        tag=data["remark"]
    )

    addInboundToDatabase(
        remark=data["remark"],
        protocol=data["protocol"],
        network=data["network"],
        port=int(data["port"])
    )

    return {
        "Message": True
    }


@app.post("/api/getInbounds")
def get_inbounds():

    return {
        "Message": True,
        "inbounds": getInboundsFromDatabase()
    }


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )