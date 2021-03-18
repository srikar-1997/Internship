const database = require("../integration/database");

async function getAllUsers() {
  const response = await database.getAllUsers();
  return response;
}

async function addUser(name, tech, sub) {
  const response = await database.addUser(name, tech, sub);
  return response;
}

async function changeSub(id, sub) {
  const response = await database.changeSub(id, sub);
  return response;
}

async function deleteUser(id) {
  const response = await database.deleteUser(id);
  return response;
}

module.exports = {
  getAllUsers,
  addUser,
  changeSub,
  deleteUser,
};
