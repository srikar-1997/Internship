const User = require("../models/users");

async function getAllUsers() {
  try {
    const users = await User.find();
    return { users: users, status: 200 };
  } catch (err) {
    console.log(error);
    return { error: "Fetching failed", status: 400 };
  }
}

async function addUser(name, tech, sub) {
  const user = new User({
    name: name,
    tech: tech,
    sub: sub,
  });
  try {
    const a1 = await user.save();
    return { message: "Successfully added", status: 200 };
  } catch (err) {
    console.log(err);
    return { message: "Adding a person to Database failed", status: 400 };
  }
}

async function changeSub(id, sub) {
  try {
    console.log(id);
    const user = await User.findById(id);
    console.log(user);
    user.sub = sub;
    await user.save();
    return { message: "ChangedSub", status: 200 };
  } catch (err) {
    return { message: "Changing the subject failed", status: 400 };
  }
}

async function deleteUser(id) {
  try {
    const user = await User.findById(id);
    await User.remove(user);
    return { message: "User Removed", status: 200 };
  } catch (err) {
    return { message: "Removing the user failed", status: 400 };
  }
}

module.exports = {
  getAllUsers,
  addUser,
  changeSub,
  deleteUser,
};
