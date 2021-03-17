const database = require("../integration/database");

async function getAllUsers() {
  const response = await database.getAllUsers();
  return response;
}

async function addUser(request) {
  const response = await database.addUser(request);
  return response;
}

async function changeSub(request) {
  const response = await database.changeSub(request);
  return response;
}

async function deleteUser(request) {
  const response = await database.deleteUser(request);
  return response;
}

module.exports = {
  getAllUsers,
  addUser,
  changeSub,
  deleteUser,
};
