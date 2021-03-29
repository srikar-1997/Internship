import os
from models import *

from flask import Flask, session, render_template, request, redirect, url_for, jsonify
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import logging
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc, or_, and_


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config.from_object(__name__)
Session(app)

app.config["TEMPLATES_AUTO_RELOAD"] = True

engine = create_engine(os.getenv("DATABASE_URL"))
db1 = scoped_session(sessionmaker(bind=engine))



@app.route("/addUser", methods=["POST"])
def add_user():
    try:
        id = request.form.get("id")
        name = request.form.get("name")
        user = Users(id = id, name = name, isVoted = False)
        db.session.add(user)
        db.session.commit()
        return jsonify({"status": 200, "msg": "User successfully added" })
    except:
        return jsonify({"status": 400, "msg": "adding user failed" })

@app.route("/updateUser", methods=["PUT"])
def update_user():
    try:
        id = request.form.get("id")
        user = Users.query.get(id)
        user.isVoted = True
        db.session.add(user)
        db.session.commit()
        return jsonify({"status": 200, "msg": "updating user details successful" })
    except:
        return jsonify({"status": 400, "msg": "updating user details failed" })

@app.route("/getUsers", methods=["GET"])
def get_user():
    try:
        users = Users.query.all()
        print(users)
        users_dict = {}
        for user in users:
            new_user = {}
            new_user["id"] = user.id
            new_user["name"] = user.name
            new_user["isVoted"] = user.isVoted
            users_dict[user.id] = new_user
        return users_dict
    except:
        return jsonify({"status": 400, "msg": "getting users failed" })
    
@app.route("/deleteUser", methods=["DELETE"])
def delete_user():
    try:
        id = request.form.get("id")
        user = Users.query.get(id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"status": 200, "msg": "deleting user success" })
    except:
        return jsonify({"status": 400, "msg": "getting users failed" })





