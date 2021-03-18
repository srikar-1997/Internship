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

async function getAccessTokenFromShopify(
  accessTokenRequestURL,
  accessTokenPayLoad,
  shop
) {
  let getAccessTokenFromShopifyResponse = await shopifyIntegration.getAccessTokenFromShopify(
    accessTokenRequestURL,
    accessTokenPayLoad,
    shop
  );
  return getAccessTokenFromShopifyResponse;
}

async function getProductsFromStore(apiRequestURL, apiRequestHeader) {
  let getProductsFromStoreResponse = await shopifyIntegration.getProductsFromStore(
    apiRequestURL,
    apiRequestHeader
  );
  return getProductsFromStoreResponse;
}

async function addProductToStore(apiRequestURL, apiRequestHeader, product) {
  let addProductToStoreResponse = await shopifyIntegration.addProductToStore(
    apiRequestURL,
    apiRequestHeader,
    product
  );
  return addProductToStoreResponse;
}

async function deleteProductFromStore(apiRequestURL, apiRequestHeader) {
  let deleteProductFromStoreResponse = await shopifyIntegration.deleteProductFromStore(
    apiRequestURL,
    apiRequestHeader
  );
  return deleteProductFromStoreResponse;
}

async function updateProductTitleInStore(
  apiRequestURL,
  apiRequestHeader,
  product
) {
  let updateProductTitleInStoreResponse = await shopifyIntegration.updateProductTitleInStore(
    apiRequestURL,
    apiRequestHeader,
    product
  );
  return updateProductTitleInStoreResponse;
}

async function addProductImage(apiRequestURL, apiRequestHeader, image) {
  let addProductImageResponse = await shopifyIntegration.addProductImage(
    apiRequestURL,
    apiRequestHeader,
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
  updateProductTitleInStore,
  addProductImage,
};
