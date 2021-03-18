const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Store", storeSchema);
