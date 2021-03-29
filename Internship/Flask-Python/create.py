import os

from flask import Flask, render_template, request
from models import *

app = Flask(__name__)
os.environ["DATABASE_URL"] = "postgresql://postgres:Srikar@123@localhost:5432/USERSDB"
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

def main():
    db.create_all()

if __name__ == "__main__":
    with app.app_context():
        main()
