var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/install", function (req, res) {
  const response = isStorePresent(request);
  return response;
});

router.get("/callback", function (req, res) {
  res.send("respond with a resource");
});

module.exports = router;
