var express = require("express");
var router = express.Router();
var userService = require("../service/userservice");
var Student = require("../models/students");
var Address = require("../models/address");
var NewAddress = require("../models/newaddress");
const NewStudent = require("../models/newstudents");

/* GET users listing. */
router.get("/getUsers", async function (req, res, next) {
  let getUsersResponse = await userService.getUsers();
  res.send(getUsersResponse);
});

router.post("/addUser", async function (req, res, next) {
  if (!req.body.name || !req.body.rollno) {
    res.send("Name or roll no paramaters missing");
  }
  let name = req.body.name;
  let rollno = req.body.rollno;
  let addUserResponse = await userService.addUser(name, rollno);
  res.send(addUserResponse);
});

router.patch("/updateUser", async function (req, res, next) {
  if (!req.body.name || !req.body.rollno) {
    res.send("Name or roll no paramaters missing");
  }
  let name = req.body.name;
  let rollno = req.body.rollno;
  console.log(name, rollno);
  let updateUserNameResponse = await userService.updateUserName(name, rollno);
  res.send(updateUserNameResponse);
});

router.delete("/deleteUser", async function (req, res, next) {
  if (!req.body.rollno) {
    res.send("roll no paramater is missing");
  }
  let rollno = req.body.rollno;
  let deleteUserResponse = await userService.deleteUser(rollno);
  res.send(deleteUserResponse);
});

router.post("/getAddressWithStudent", async function (req, res, next) {
  if (!req.body.id) {
    res.send("id paramater missing");
  }
  let id = req.body.id;
  console.log(id);
  try {
    let val = await Student.where({ id: id }).fetch({
      withRelated: ["area"],
    });

    console.log(val.toJSON());
    res.send(val.toJSON());
  } catch (e) {
    console.log(`Failed to fetch data: ${e}`);
    res.send(e);
  }
});

router.post("/getStudentWithAddress", async function (req, res, next) {
  if (!req.body.pincode) {
    res.send("pincode paramater missing");
  }
  let pincode = req.body.pincode;
  console.log(pincode);
  try {
    let val = await Address.where({ pincode: pincode }).fetch({
      withRelated: ["student"],
      require: true,
    });

    console.log(val.toJSON());
    res.send(val.toJSON());
  } catch (e) {
    console.log(`Failed to fetch data: ${e}`);
    res.send(e);
  }
});

router.post("/getStudentsWithNewAddress", async function (req, res, next) {
  if (!req.body.pincode) {
    res.send("pincode paramater missing");
  }
  let pincode = req.body.pincode;
  console.log(pincode);
  try {
    let val = await NewAddress.where({ pincode: pincode }).fetch({
      withRelated: ["newstudent"],
      require: true,
    });

    console.log(val.toJSON());
    res.send(val.toJSON());
  } catch (e) {
    console.log(`Failed to fetch data: ${e}`);
    res.send(e);
  }
});

module.exports = router;
