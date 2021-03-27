const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
  sku: { type: String, unique: true },
  product: {
    id: Number,
    title: String,
    body_html: String,
    vendor: String,
    product_type: String,
    tags: Array,
    price: Number,
    status: String,
    variants: [
      {
        id: Number,
        product_id: Number,
        title: String,
        option1: String,
        price: Number,
        sku: String,
        inventory_management: String,
        currency: String,
        weight_unit: String,
        weight: Number,
        inventory_quantity: Number,
        inventory_item_id: Number,
        barcode: Number,
        requires_shipping: Boolean,
        images: [
          {
            id: Number,
            product_id: Number,
            alt: String,
            width: Number,
            height: Number,
            src: String,
          },
        ],
      },
    ],
    options: [
      {
        id: Number,
        product_id: Number,
        name: String,
        position: Number,
        values: [String],
      },
    ],
    images: [
      {
        id: Number,
        product_id: Number,
        alt: String,
        src: String,
      },
    ],
  },
});

module.exports = mongoose.model("Product", productSchema);
