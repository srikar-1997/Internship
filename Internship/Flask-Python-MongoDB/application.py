from flask import Flask, request, jsonify
from models import User, db


app = Flask(__name__)
db.init_app(app)

app.config['MONGODB_SETTINGS'] = {
    'db': 'flask-crud-mongodb',
    'host': 'localhost',
    'port': '27017',
}




@app.route('/getUsers', methods=["GET"])
def get_users():
    users = User.objects()
    return jsonify(users), 200


@app.route("/addUser", methods=["POST"])
def create_user():
    id = request.form.get('id')
    name = request.form.get('name')
    user = User(id=id, name=name, isVoted=False)
    user.save()
    return jsonify(user.to_json())


@app.route('/deleteUser', methods=['DELETE'])
def delete_record():
    id = request.form.get('id')
    user = User.objects(id=id).first()
    if not user:
        return jsonify({'error': 'data not found'})
    else:
        user.delete()
    return jsonify(user.to_json())


@app.route('/updateUser', methods=['PATCH'])
def update_record():
    id = request.form.get('id')
    user = User.objects(id=id).first()
    if not user:
        return jsonify({'error': 'data not found'})
    else:
        user.update(isVoted=True)
    return jsonify(user.to_json())

if __name__ == "__main__":
    app.run(debug=True)