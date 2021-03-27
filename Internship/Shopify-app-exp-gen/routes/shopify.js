var express = require("express");
var router = express.Router();
const shopifyService = require("../service/shopifyService");
const nonce = require("nonce")();
const forwardingAddress = "https://06d1cc648116.ngrok.io";
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = "write_products, write_orders";
const cookie = require("cookie");
const request = require("request-promise");
const axios = require("axios");

/* GET users listing. */
router.get("/", async function (req, res) {
  const shop = req.query.shop;
  if (shop) {
    let isShopInDBResponse = await shopifyService.isShopInDB(shop);
    if (isShopInDBResponse.status === 200) {
      res.redirect(`/shopify/getProducts?shop=${shop}`);
    } else {
      const state = nonce();
      const installUrl = await shopifyService.redirecURL(
        shop,
        apiKey,
        scopes,
        state,
        forwardingAddress
      );

      res.cookie("state", state);
      res.redirect(installUrl);
    }
  } else {
    return res
      .status(400)
      .send(
        "Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request"
      );
  }
});

router.get("/callback", async function (req, res) {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if ((await shopifyService.cookieVerification(state, stateCookie)) === false) {
    return res.status(403).send("Request origin cannot be verified");
  }

  if (shop && hmac && code) {
    const generatedHmac = await shopifyService.generateHmac(req, apiSecret);
    if (
      (await shopifyService.hmacVerification(hmac, generatedHmac)) === false
    ) {
      return res.status(400).send("HMAC validation failed");
    }

    let getAccessTokenFromShopifyResponse = await shopifyService.getAccessTokenFromShopify(
      apiKey,
      apiSecret,
      code,
      shop
    );
    if (getAccessTokenFromShopifyResponse.status === 200) {
      res.redirect(`/shopify/getProducts?shop=${shop}`);
    } else {
      res.status(400).send(getAccessTokenFromShopifyResponse["msg"]);
    }
  } else {
    res.status(400).send("Required parameters missing");
  }
});

router.get("/getProducts", async (req, res) => {
  const shop = req.query.shop;
  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  let accessToken = isShopInDBResponse["accessToken"];

  let getProductsFromStoreResponse = await shopifyService.getProductsFromStore(
    shop,
    accessToken
  );

  if (getProductsFromStoreResponse.status === 200) {
    res.send(getProductsFromStoreResponse.products);
  } else {
    res.send(getProductsFromStoreResponse);
  }
});

router.post("/addProduct", async (req, res) => {
  const shop = req.query.shop;
  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  let accessToken = isShopInDBResponse["accessToken"];
  let product = req.body.product;

  let addProductToStoreResponse = await shopifyService.addProductToStore(
    shop,
    accessToken,
    product
  );

  if (addProductToStoreResponse.status === 200) {
    res.send(addProductToStoreResponse);
  } else {
    res.send(addProductToStoreResponse);
  }
});

router.delete("/deleteProduct", async (req, res) => {
  const shop = req.query.shop;
  const id = req.body.id;
  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  let accessToken = isShopInDBResponse["accessToken"];

  let deleteProductFromStoreResponse = await shopifyService.deleteProductFromStore(
    shop,
    id,
    accessToken
  );

  if (deleteProductFromStoreResponse.status === 200) {
    res.send(deleteProductFromStoreResponse);
  } else {
    res.send(deleteProductFromStoreResponse);
  }
});

router.put("/updateProduct", async (req, res) => {
  const shop = req.query.shop;
  const id = req.body.product.product.id;
  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  let accessToken = isShopInDBResponse["accessToken"];
  let product = req.body.product;

  let updateProductInStoreResponse = await shopifyService.updateProductInStore(
    shop,
    id,
    accessToken,
    product
  );

  if (updateProductInStoreResponse.status === 200) {
    res.send(updateProductInStoreResponse);
  } else {
    res.send(updateProductInStoreResponse);
  }
});

router.post("/addProductImage/:id", async (req, res) => {
  const shop = req.query.shop;
  const id = req.params.id;
  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  let accessToken = isShopInDBResponse["accessToken"];
  let image = req.body.image;

  let addProductImageResponse = await shopifyService.addProductImage(
    shop,
    id,
    accessToken,
    image
  );

  if (addProductImageResponse.status === 200) {
    res.send(addProductImageResponse);
  } else {
    res.send(addProductImageResponse);
  }
});

router.post("/getOrdersFromShopifyStore", async (req, res) => {
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;

  let getOrdersFromShopifyStoreResponse = await shopifyService.getOrdersFromShopifyStore(
    shop,
    privateAppAPIKey,
    privateAppPassword
  );

  if (getOrdersFromShopifyStoreResponse.status === 200) {
    res.send(getOrdersFromShopifyStoreResponse);
  } else {
    res.send(getOrdersFromShopifyStoreResponse);
  }
});

router.post("/PlaceOrder", async (req, res) => {
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let order = req.body.order;
  let dbOrderId = req.body.dbOrderId;

  let placeOrderResponse = await shopifyService.placeOrder(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    order,
    dbOrderId
  );

  if (placeOrderResponse.status === 200) {
    res.send(placeOrderResponse);
  } else {
    res.send(placeOrderResponse);
  }
});

router.post("/updateOrder", async (req, res) => {
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let order = req.body.order;
  let dbOrderId = req.body.dbOrderId;
  let id = order.order.id;

  let updateOrderResponse = await shopifyService.updateOrder(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    order,
    dbOrderId,
    id
  );

  if (updateOrderResponse.status === 200) {
    res.send(updateOrderResponse);
  } else {
    res.send(updateOrderResponse);
  }
});

router.post("/getProductsFromShopifyStorePrivateApp", async (req, res) => {
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;

  let getProductsFromShopifyStorePrivateAppResponse = await shopifyService.getProductsFromShopifyStorePrivateApp(
    shop,
    privateAppAPIKey,
    privateAppPassword
  );

  if (getProductsFromShopifyStorePrivateAppResponse.status === 200) {
    res.send(getProductsFromShopifyStorePrivateAppResponse);
  } else {
    res.send(getProductsFromShopifyStorePrivateAppResponse);
  }
});

router.post("/addProductIntoShopifyStorePrivateApp", async (req, res) => {
  let sku = req.body.sku;
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let product = req.body.product;

  let addProductIntoShopifyStorePrivateAppResponse = await shopifyService.addProductIntoShopifyStorePrivateApp(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    product,
    sku
  );

  if (addProductIntoShopifyStorePrivateAppResponse.status === 200) {
    res.send(addProductIntoShopifyStorePrivateAppResponse);
  } else {
    res.send(addProductIntoShopifyStorePrivateAppResponse);
  }
});

router.post("/updateProductInStorePrivateApp", async (req, res) => {
  const id = req.body.product.product.id;
  let sku = req.body.sku;
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let product = req.body.product;

  let updateProductInStorePrivateAppResponse = await shopifyService.updateProductInStorePrivateApp(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    product,
    sku,
    id
  );

  if (updateProductInStorePrivateAppResponse.status === 200) {
    res.send(updateProductInStorePrivateAppResponse);
  } else {
    res.send(updateProductInStorePrivateAppResponse);
  }
});

router.post("/deleteProductInStorePrivateApp", async (req, res) => {
  const id = req.body.id;
  let sku = req.body.sku;
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;

  let deleteProductInStorePrivateAppResponse = await shopifyService.deleteProductInStorePrivateApp(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    sku,
    id
  );

  if (deleteProductInStorePrivateAppResponse.status === 200) {
    res.send(deleteProductInStorePrivateAppResponse);
  } else {
    res.send(deleteProductInStorePrivateAppResponse);
  }
});

router.post("/getInventoryDetailsFromShopifyStore", async (req, res) => {
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let inventory_item = req.body.inventory_item;
  // let location_id = req.body.location_id;
  let locationDetails = await shopifyService.getLocationDetails(
    shop,
    privateAppAPIKey,
    privateAppPassword
  );

  console.log(locationDetails.data.locations[0].id);
  let location_id = locationDetails.data.locations[0].id;

  let getInventoryDetailsFromShopifyStoreResponse = await shopifyService.getInventoryDetailsFromShopifyStore(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    location_id
  );

  if (getInventoryDetailsFromShopifyStoreResponse.status === 200) {
    res.send(getInventoryDetailsFromShopifyStoreResponse);
  } else {
    res.send(getInventoryDetailsFromShopifyStoreResponse);
  }
});

router.post("/changeInventoryDetailsInShopifyStore", async (req, res) => {
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let inventory_item = req.body.inventory_item;

  let changeInventoryDetailsInShopifyStoreResponse = await shopifyService.changeInventoryDetailsInShopifyStore(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    inventory_item
  );

  if (changeInventoryDetailsInShopifyStoreResponse.status === 200) {
    res.send(changeInventoryDetailsInShopifyStoreResponse);
  } else {
    res.send(changeInventoryDetailsInShopifyStoreResponse);
  }
});

router.post("/getLocationDetails", async (req, res) => {
  let shop = req.body.shop;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;

  let getLocationDetailsResponse = await shopifyService.getLocationDetails(
    shop,
    privateAppAPIKey,
    privateAppPassword
  );

  console.log(shop);

  if (getLocationDetailsResponse.status === 200) {
    res.send(getLocationDetailsResponse);
  } else {
    res.send(getLocationDetailsResponse);
  }
});

router.post("/captureTransaction", async (req, res) => {
  let shop = req.body.shop;
  let order_id = req.body.order_id;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let transaction = req.body.transaction;

  let captureTransactionResponse = await shopifyService.captureTransaction(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    order_id,
    transaction
  );

  console.log(shop);

  if (captureTransactionResponse.status === 200) {
    res.send(captureTransactionResponse);
  } else {
    res.send(captureTransactionResponse);
  }
});

router.get("/getFulfillments", async (req, res) => {
  let shop = req.body.shop;
  let order_id = req.body.order_id;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;

  let getFulfillmentsResponse = await shopifyService.getFulfillments(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    order_id
  );

  console.log(shop);

  if (getFulfillmentsResponse.status === 200) {
    res.send(getFulfillmentsResponse);
  } else {
    res.send(getFulfillmentsResponse);
  }
});

router.post("/addFulfillments", async (req, res) => {
  let shop = req.body.shop;
  let order_id = req.body.order_id;
  let privateAppAPIKey = process.env.PRIVATE_APP_KEY;
  let privateAppPassword = process.env.PRIVATE_APP_PASSWORD;
  let fulfillment = req.body.fulfillment;

  let addFulfillmentsResponse = await shopifyService.addFulfillments(
    shop,
    privateAppAPIKey,
    privateAppPassword,
    order_id,
    fulfillment
  );

  console.log(shop);

  if (addFulfillmentsResponse.status === 200) {
    res.send(addFulfillmentsResponse);
  } else {
    res.send(addFulfillmentsResponse);
  }
});

module.exports = router;
