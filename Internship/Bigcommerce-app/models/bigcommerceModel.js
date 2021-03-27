const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  storeHash: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Store", storeSchema);
