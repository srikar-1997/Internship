const mongoose = require("mongoose");

let inventorySchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  inventory_item_id: {
    type: Number,
    required: true,
  },
  location_id: {
    type: Number,
    required: true,
  },
  inventory_quantity: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Inventory", inventorySchema);
