from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import BIGINT

db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, nullable = False, primary_key = True)
    name = db.Column(db.String(200), nullable = False)
    isVoted = db.Column(db.Boolean, nullable = False)

    
    def __init__(self, id, name, isVoted):
        self.id = id
        self.name = name
        self.isVoted = isVoted