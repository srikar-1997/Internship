const express = require("express");
const router = express.Router();
const service = require("../service/service");

router.get("/getUsers", async (req, res) => {
  const response = await service.getAllUsers();
  res.send(response);
});

router.post("/addUser", async (req, res) => {
  const name = req.body.name;
  const tech = req.body.tech;
  const sub = req.body.sub;
  const response = await service.addUser(name, tech, sub);
  res.send(response);
});

router.patch("/changeSub/:id", async (req, res) => {
  const id = req.params.id;
  const sub = req.body.sub;
  const response = await service.changeSub(id, sub);
  res.send(response);
});

router.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  const response = await service.deleteUser(id);
  res.send(response);
});
module.exports = router;
