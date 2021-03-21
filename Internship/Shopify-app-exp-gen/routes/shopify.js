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

module.exports = router;
