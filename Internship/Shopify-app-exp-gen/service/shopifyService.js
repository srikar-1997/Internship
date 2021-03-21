const shopifyIntegration = require("../integration/shopifyIntegration");
const querystring = require("querystring");
const crypto = require("crypto");

async function isShopInDB(shop) {
  let getAccessTokenFromDBResponse = await shopifyIntegration.getAccessTokenFromDB(
    shop
  );
  return getAccessTokenFromDBResponse;
}

async function redirecURL(shop, apiKey, scopes, state, forwardingAddress) {
  const installUrl =
    "https://" +
    shop +
    "/admin/oauth/authorize?client_id=" +
    apiKey +
    "&scope=" +
    scopes +
    "&state=" +
    state +
    "&redirect_uri=" +
    forwardingAddress +
    "/shopify/callback";

  return installUrl;
}

async function cookieVerification(state, stateCookie) {
  if (state !== stateCookie) {
    return false;
  }
}

async function generateHmac(req, apiSecret) {
  const map = Object.assign({}, req.query);
  delete map["hmac"];
  const msg = querystring.stringify(map);
  const generatedHash = crypto
    .createHmac("sha256", apiSecret)
    .update(msg)
    .digest("hex");

  return generatedHash;
}

async function hmacVerification(hmac, generatedHmac) {
  if (hmac !== generatedHmac) {
    return false;
  }
}

async function getAccessTokenFromShopify(apiKey, apiSecret, code, shop) {
  let getAccessTokenFromShopifyResponse = await shopifyIntegration.getAccessTokenFromShopify(
    apiKey,
    apiSecret,
    code,
    shop
  );
  return getAccessTokenFromShopifyResponse;
}

async function getProductsFromStore(shop, accessToken) {
  let getProductsFromStoreResponse = await shopifyIntegration.getProductsFromStore(
    shop,
    accessToken
  );
  return getProductsFromStoreResponse;
}

async function addProductToStore(shop, accessToken, product) {
  let addProductToStoreResponse = await shopifyIntegration.addProductToStore(
    shop,
    accessToken,
    product
  );
  return addProductToStoreResponse;
}

async function deleteProductFromStore(shop, id, accessToken) {
  let deleteProductFromStoreResponse = await shopifyIntegration.deleteProductFromStore(
    shop,
    id,
    accessToken
  );
  return deleteProductFromStoreResponse;
}

async function updateProductInStore(shop, id, accessToken, product) {
  let updateProductInStoreResponse = await shopifyIntegration.updateProductInStore(
    shop,
    id,
    accessToken,
    product
  );
  return updateProductInStoreResponse;
}

async function addProductImage(shop, id, accessToken, image) {
  let addProductImageResponse = await shopifyIntegration.addProductImage(
    shop,
    id,
    accessToken,
    image
  );
  return addProductImageResponse;
}

module.exports = {
  redirecURL,
  isShopInDB,
  generateHmac,
  cookieVerification,
  hmacVerification,
  getAccessTokenFromShopify,
  getProductsFromStore,
  addProductToStore,
  deleteProductFromStore,
  updateProductInStore,
  addProductImage,
};
