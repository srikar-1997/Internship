const userIntegration = require("../integration/userintegration");

async function getUsers() {
  let getUsersResponse = await userIntegration.getUsers();
  return getUsersResponse;
}

async function addUser(name, rollno) {
  let addUserResponse = await userIntegration.addUser(name, rollno);
  return addUserResponse;
}

async function updateUserName(name, rollno) {
  let updateUserNameResponse = await userIntegration.updateUserName(
    name,
    rollno
  );
  return updateUserNameResponse;
}

async function deleteUser(rollno) {
  let deleteUserResponse = await userIntegration.deleteUser(rollno);
  return deleteUserResponse;
}

module.exports = {
  getUsers,
  addUser,
  updateUserName,
  deleteUser,
};
