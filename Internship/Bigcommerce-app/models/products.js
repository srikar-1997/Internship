const mongoose = require("mongoose");

let productSchema = new mongoose.Schema(
  {
    sku: String,
    product: {
      id: Number,
      name: String,
      price: String,
      categories: Array,
      weight: Number,
      type: String,
      variants: [
        {
          sku: String,
          option_values: [
            {
              option_display_name: String,
              label: String,
            },
          ],
        },
      ],
    },
  },
  { typeKey: "$type" }
);

module.exports = mongoose.model("Product", productSchema);
