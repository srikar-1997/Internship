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

async function addUser(request) {
  const user = new User({
    name: request.body.name,
    tech: request.body.tech,
    sub: request.body.sub,
  });
  try {
    const a1 = await user.save();
    return { message: "Successfully added", status: 200 };
  } catch (err) {
    console.log(err);
    return { message: "Adding a person to Database failed", status: 400 };
  }
}

async function changeSub(request) {
  try {
    console.log(request.params.id);
    const user = await User.findById(request.params.id);
    console.log(user);
    user.sub = request.body.sub;
    await user.save();
    return { message: "ChangedSub", status: 200 };
  } catch (err) {
    return { message: "Changing the subject failed", status: 400 };
  }
}

async function deleteUser(request) {
  try {
    const user = await User.findById(request.params.id);
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
