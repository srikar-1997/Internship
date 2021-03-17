const express = require("express");
const router = express.Router();
const service = require("../service/service");

router.get("/getUsers", async (req, res) => {
  const response = await service.getAllUsers();
  res.send(response);
});

router.post("/addUser", async (req, res) => {
  const response = await service.addUser(req);
  res.send(response);
});

router.patch("/changeSub/:id", async (req, res) => {
  const response = await service.changeSub(req);
  res.send(response);
});

router.delete("/deleteUser/:id", async (req, res) => {
  const response = await service.deleteUser(req);
  res.send(response);
});
module.exports = router;
