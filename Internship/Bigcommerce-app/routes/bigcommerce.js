var express = require("express");
var router = express.Router();
const axios = require("axios");
const bcStore = require("../models/bigcommerceModel");
const base64url = require("base64url");
const crypto = require("crypto");
const ProductDB = require("../models/products");

/* GET users listing. */
router.get("/auth", async function (req, res, next) {
  let code = req.query.code;
  let hash = req.query.context;
  let scopes = req.query.scope;
  console.log(scopes);

  let url = "https://login.bigcommerce.com/oauth2/token";

  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let body =
    "client_id=" +
    process.env.BigCommerce_Client_id +
    "&client_secret=" +
    process.env.BigCommerce_Client_Secret +
    "&code=" +
    code +
    "&scope=" +
    scopes +
    "&grant_type=authorization_code&redirect_uri=" +
    "https://85b0718df514.ngrok.io/bigcommerce/auth" +
    "&context=" +
    hash;

  let accessTokenData;
  try {
    accessTokenData = await axios.post(url, body, { headers: headers });
    console.log(accessTokenData.data);
    const newStore = new bcStore({
      userId: accessTokenData.data.user.id,
      accessToken: accessTokenData.data.access_token,
      storeHash: hash.split("/")[1],
    });
    res.send("access token retrived and stored in db");
    await newStore.save();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/load", async function (req, res, next) {
  const pay_load = req.query.signed_payload;
  const pay_load_split = pay_load.split(".");
  const encoded_json_string = pay_load_split[0];
  const decoded_json_string = base64url.decode(encoded_json_string);
  const json_obj = JSON.parse(decoded_json_string);
  console.log(json_obj);
  const encoded_hmac_sig = pay_load_split[1];
  const decoded_hmac_sig = base64url.decode(encoded_hmac_sig);
  const gen_hmac = crypto
    .createHmac("sha256", process.env.BigCommerce_Client_Secret)
    .update(decoded_json_string)
    .digest("hex");
  if (gen_hmac != decoded_hmac_sig) {
    res.send("hmac validation failed");
  }
  res.redirect(`/bigcommerce/getProducts?storeHash=${json_obj.store_hash}`);
});

router.get("/getProducts", async function (req, res) {
  let storeHash = req.query.storeHash;
  let url =
    "https://api.bigcommerce.com/stores/" + storeHash + "/v3/catalog/products";
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    // let productData = await axios.get(url, { headers: headers });
    let productData = await ProductDB.find({});
    res.send(productData);
  } catch (e) {
    console.log(e);
  }
});

router.post("/addProductInStore", async function (req, res) {
  let storeHash = req.query.storeHash;
  let product = req.body.product;
  let sku = req.body.sku;
  let url =
    "https://api.bigcommerce.com/stores/" + storeHash + "/v3/catalog/products";
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    const productD = new ProductDB({
      sku: sku,
      product: product,
    });
    await productD.save();
    let productData = await axios.post(url, product, {
      headers: headers,
    });
    productDB = await ProductDB.findOne({ sku: sku });
    productDB.product.id = productData.data.data.id;
    await productDB.save();
    console.log(productData.data.data.id);
    res.send(productData.data);
  } catch (e) {
    console.log(e);
  }
});

router.post("/addProductImageInStore", async function (req, res) {
  let storeHash = req.query.storeHash;
  let productImage = req.body;
  let productId = req.query.productId;
  let url =
    "https://api.bigcommerce.com/stores/" +
    storeHash +
    "/v3/catalog/products/" +
    productId +
    "/images";
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    let productData = await axios.post(url, productImage, { headers: headers });
    res.send(productData.data);
  } catch (e) {
    console.log(e);
  }
});

router.post("/updateProductDetails", async function (req, res) {
  let storeHash = req.query.storeHash;
  let product = req.body;
  let productId = req.query.productId;
  let sku = req.query.sku;
  let url =
    "https://api.bigcommerce.com/stores/" +
    storeHash +
    "/v3/catalog/products/" +
    productId;
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    let productDB = await ProductDB.findOne({ sku: sku });
    productDB.product.name = req.body.name;
    await productDB.save();
    let productData = await axios.put(url, product, {
      headers: headers,
    });
    res.send(productData.data);
  } catch (e) {
    console.log(e);
  }
});

router.get("/deleteProductInStore", async function (req, res) {
  let storeHash = req.query.storeHash;
  let productId = req.query.productId;
  let sku = req.query.sku;
  let url =
    "https://api.bigcommerce.com/stores/" +
    storeHash +
    "/v3/catalog/products/" +
    productId;
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    let productDB = await ProductDB.findOne({ sku: sku });
    await productDB.remove();
    let productData = await axios.delete(url, {
      headers: headers,
    });
    res.send(productData.data);
  } catch (e) {
    console.log(e);
  }
});

router.post("/placeOrder", async function (req, res) {
  let storeHash = req.query.storeHash;
  let order = req.body;
  let url = "https://api.bigcommerce.com/stores/" + storeHash + "/v2/orders";
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    let orderData = await axios.post(url, order, { headers: headers });
    res.send(orderData.data);
  } catch (e) {
    console.log(e);
  }
});

router.get("/getOrders", async function (req, res) {
  let storeHash = req.query.storeHash;
  let url = "https://api.bigcommerce.com/stores/" + storeHash + "/v2/orders";
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    let orderData = await axios.get(url, { headers: headers });
    res.send(orderData.data);
  } catch (e) {
    console.log(e);
  }
});

router.post("/updateOrder", async function (req, res) {
  let storeHash = req.query.storeHash;
  let orderId = req.query.orderId;
  let order = req.body;
  let url =
    "https://api.bigcommerce.com/stores/" + storeHash + "/v2/orders/" + orderId;
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    let orderData = await axios.put(url, order, { headers: headers });
    res.send(orderData.data);
  } catch (e) {
    console.log(e);
  }
});

router.get("/deleteOrder", async function (req, res) {
  let storeHash = req.query.storeHash;
  let orderId = req.query.orderId;
  let url =
    "https://api.bigcommerce.com/stores/" + storeHash + "/v2/orders/" + orderId;
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-token": (await bcStore.findOne({ storeHash: storeHash }))
      .accessToken,
  };
  try {
    let orderData = await axios.delete(url, { headers: headers });
    res.send(orderData.data);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
