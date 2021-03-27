const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
  dbOrderId: { type: String, unique: true },
  order: {
    id: Number,
    line_items: [
      {
        title: String,
        price: Number,
        grams: String,
        quantity: Number,
      },
    ],
    customer: {
      first_name: String,
      last_name: String,
      email: String,
    },
    billing_address: {
      first_name: String,
      last_name: String,
      address1: String,
      phone: String,
      city: String,
      province: String,
      country: String,
      zip: String,
    },
    shipping_address: {
      first_name: String,
      last_name: String,
      address1: String,
      phone: String,
      city: String,
      province: String,
      country: String,
      zip: String,
    },
    email: String,
    transactions: [
      {
        kind: String,
        status: String,
        amount: Number,
      },
    ],
    financial_status: String,
  },
});
module.exports = mongoose.model("Order", orderSchema);
