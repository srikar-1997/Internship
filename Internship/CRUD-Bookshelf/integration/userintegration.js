const User = require("../models/users").User;

async function getUsers() {
  try {
    let vals = await User.fetchAll();
    console.log(vals.toJSON());
    return vals.toJSON();
  } catch (e) {
    console.log(`Failed to fetch data: ${e}`);
    return e;
  }
}

async function addUser(name, rollno) {
  try {
    let vals = await User.forge({ name: name, rollno: rollno }).save();
    return {
      msg: "adding user success",
      status: 200,
    };
  } catch (e) {
    console.log(`Failed to fetch data: ${e}`);
    return e;
  }
}

async function updateUserName(name, rollno) {
  try {
    let vals = await User.where({ rollno: rollno }).save(
      { name: name },
      { patch: true }
    );
    return { msg: "updating user success", status: 200 };
  } catch (e) {
    console.log(`Failed to fetch data: ${e}`);
    return e;
  }
}

async function deleteUser(rollno) {
  try {
    let vals = await User.where({ rollno: rollno }).destroy();
    return {
      msg: "deleting user success",
      status: 200,
    };
  } catch (e) {
    console.log(`Failed to fetch data: ${e}`);
    return e;
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUserName,
  deleteUser,
};
