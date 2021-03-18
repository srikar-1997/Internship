var express = require("express");
var router = express.Router();
const shopifyService = require("../service/shopifyService");
const nonce = require("nonce")();
const forwardingAddress = "https://cb1425ea002f.ngrok.io";
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = "write_products";
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

    const accessTokenRequestURL =
      "https://" + shop + "/admin/oauth/access_token";
    const accessTokenPayLoad = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };

    let getAccessTokenFromShopifyResponse = await shopifyService.getAccessTokenFromShopify(
      accessTokenRequestURL,
      accessTokenPayLoad,
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
  const apiRequestURL = "https://" + shop + "/admin/api/2021-01/products.json";

  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  const apiRequestHeader = {
    "X-Shopify-Access-Token": isShopInDBResponse["accessToken"],
  };
  console.log(apiRequestHeader);
  let getProductsFromStoreResponse = await shopifyService.getProductsFromStore(
    apiRequestURL,
    apiRequestHeader
  );

  if (getProductsFromStoreResponse.status === 200) {
    res.send(getProductsFromStoreResponse.products);
  } else {
    res.send(getProductsFromStoreResponse);
  }
});

router.post("/addProduct", async (req, res) => {
  const shop = req.query.shop;
  const apiRequestURL = "https://" + shop + "/admin/api/2021-01/products.json";

  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  const apiRequestHeader = {
    "X-Shopify-Access-Token": isShopInDBResponse["accessToken"],
  };
  console.log(apiRequestHeader);

  let product = req.body.product;
  console.log(product);

  let addProductToStoreResponse = await shopifyService.addProductToStore(
    apiRequestURL,
    apiRequestHeader,
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
  const apiRequestURL =
    "https://" + shop + "/admin/api/2021-01/products/" + id + ".json";

  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  const apiRequestHeader = {
    "X-Shopify-Access-Token": isShopInDBResponse["accessToken"],
  };
  console.log(apiRequestHeader);

  let deleteProductFromStoreResponse = await shopifyService.deleteProductFromStore(
    apiRequestURL,
    apiRequestHeader
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
  const apiRequestURL =
    "https://" + shop + "/admin/api/2021-01/products/" + id + ".json";

  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  const apiRequestHeader = {
    "X-Shopify-Access-Token": isShopInDBResponse["accessToken"],
  };
  console.log(apiRequestHeader);
  let product = req.body.product;

  let updateProductTitleInStoreResponse = await shopifyService.updateProductTitleInStore(
    apiRequestURL,
    apiRequestHeader,
    product
  );

  if (updateProductTitleInStoreResponse.status === 200) {
    res.send(updateProductTitleInStoreResponse);
  } else {
    res.send(updateProductTitleInStoreResponse);
  }
});

router.post("/addProductImage/:id", async (req, res) => {
  const shop = req.query.shop;
  const id = req.params.id;
  const apiRequestURL =
    "https://" + shop + "/admin/api/2021-01/products/" + id + "/images.json";

  let isShopInDBResponse = await shopifyService.isShopInDB(shop);
  const apiRequestHeader = {
    "X-Shopify-Access-Token": isShopInDBResponse["accessToken"],
  };
  console.log(apiRequestHeader);
  let image = req.body.image;

  let addProductImageResponse = await shopifyService.addProductImage(
    apiRequestURL,
    apiRequestHeader,
    image
  );

  if (addProductImageResponse.status === 200) {
    res.send(addProductImageResponse);
  } else {
    res.send(addProductImageResponse);
  }
});

module.exports = router;
