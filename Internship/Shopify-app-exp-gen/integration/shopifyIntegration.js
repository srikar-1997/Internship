const Store = require("../models/store");
const axios = require("axios");

async function addStore(shop, accessToken) {
  const store = new Store({
    shop: shop,
    accessToken: accessToken,
  });

  try {
    const shop = await store.save();
    return {
      msg: "store saved in db",
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return { msg: "adding store failed", status: 400 };
  }
}

async function getAccessTokenFromDB(shop) {
  try {
    const store = await Store.findOne({ shop: shop });
    return {
      msg: "store found in db",
      status: 200,
      accessToken: store.accessToken,
    };
  } catch (err) {
    return { msg: "store not found in db", status: 400 };
  }
}

async function getAccessTokenFromShopify(apiKey, apiSecret, code, shop) {
  let accessTokenData = "";
  const accessTokenRequestURL = "https://" + shop + "/admin/oauth/access_token";
  const accessTokenPayLoad = {
    client_id: apiKey,
    client_secret: apiSecret,
    code,
  };

  try {
    accessTokenData = await axios.post(
      accessTokenRequestURL,
      accessTokenPayLoad
    );
  } catch (error) {
    console.log(error);
    return {
      msg: "accessToken fetching failed ",
      status: 400,
    };
  }
  const accessToken = accessTokenData.data.access_token;
  const accessTokenStoring = await addStore(shop, accessToken);

  if (accessTokenStoring.status === 200) {
    return {
      status: accessTokenData.status,
      accessToken: accessToken,
      msg: "accessToken fetching success and also storing in db success",
    };
  } else {
    return {
      status: 400,
      accessToken: accessToken,
      msg: "accessToken fetching success but storing in db failed",
    };
  }
}

async function getProductsFromStore(shop, accessToken) {
  let productsData;

  const apiRequestURL = "https://" + shop + "/admin/api/2021-01/products.json";

  const apiRequestHeader = {
    "X-Shopify-Access-Token": accessToken,
  };

  try {
    productsData = await axios.get(apiRequestURL, {
      headers: apiRequestHeader,
    });
    return {
      msg: "getting products from store success",
      status: 200,
      products: productsData.data,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "getting products from store failed",
      status: 400,
    };
  }
}

async function addProductToStore(shop, accessToken, product) {
  let productsData;

  const apiRequestURL = "https://" + shop + "/admin/api/2021-01/products.json";

  const apiRequestHeader = {
    "X-Shopify-Access-Token": accessToken,
  };

  try {
    productsData = await axios.post(apiRequestURL, product, {
      headers: apiRequestHeader,
    });
    return {
      msg: "adding product to store success",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "adding product to store failed",
      status: 400,
    };
  }
}

async function deleteProductFromStore(shop, id, accessToken) {
  let productsData;

  const apiRequestURL =
    "https://" + shop + "/admin/api/2021-01/products/" + id + ".json";

  const apiRequestHeader = {
    "X-Shopify-Access-Token": accessToken,
  };

  try {
    productsData = await axios.delete(apiRequestURL, {
      headers: apiRequestHeader,
    });
    return {
      msg: "deleting product from store success",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "deleting product from store failed",
      status: 400,
    };
  }
}

async function updateProductInStore(shop, id, accessToken, product) {
  let productsData;
  const apiRequestURL =
    "https://" + shop + "/admin/api/2021-01/products/" + id + ".json";

  const apiRequestHeader = {
    "X-Shopify-Access-Token": accessToken,
  };

  try {
    productsData = await axios.put(apiRequestURL, product, {
      headers: apiRequestHeader,
    });
    return {
      msg: "updating product title in store success",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "updating product title in store failed",
      status: 400,
    };
  }
}

async function addProductImage(shop, id, accessToken, image) {
  let productsData;
  const apiRequestURL =
    "https://" + shop + "/admin/api/2021-01/products/" + id + "/images.json";
  const apiRequestHeader = {
    "X-Shopify-Access-Token": accessToken,
  };

  try {
    productsData = await axios.post(apiRequestURL, image, {
      headers: apiRequestHeader,
    });
    return {
      msg: "adding product image success",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "adding product image failed",
      status: 400,
    };
  }
}

async function getOrdersFromShopifyStore(
  shop,
  privateAppAPIKey,
  privateAppPassword
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/orders.json";
  let ordersData;

  try {
    ordersData = await axios.get(url);
    return { data: ordersData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "getting orders from store failed",
    };
  }
}

async function placeOrder(shop, privateAppAPIKey, privateAppPassword, order) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/orders.json";
  let placeOrderData;

  try {
    placeOrderData = await axios.post(url, order);
    return { data: placeOrderData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "placing order failed",
    };
  }
}

async function getProductsFromShopifyStorePrivateApp(
  shop,
  privateAppAPIKey,
  privateAppPassword
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/products.json";

  let productsData;
  try {
    productsData = await axios.get(url);
    return { data: productsData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "getting products from store failed",
    };
  }
}

async function addProductIntoShopifyStorePrivateApp(
  shop,
  privateAppAPIKey,
  privateAppPassword,
  product
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/products.json";
  let productData;

  try {
    productData = await axios.post(url, product);
    return { data: productData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "adding product into store failed",
    };
  }
}

async function getInventoryDetailsFromShopifyStore(
  shop,
  privateAppAPIKey,
  privateAppPassword,
  location_id
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/locations/" +
    location_id +
    "/inventory_levels.json";

  let inventoryData;
  try {
    inventoryData = await axios.get(url);
    return { data: inventoryData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "getting inventory details failed",
    };
  }
}

async function changeInventoryDetailsInShopifyStore(
  shop,
  privateAppAPIKey,
  privateAppPassword,
  inventory_item
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/inventory_levels/adjust.json";

  let inventoryData;
  try {
    inventoryData = await axios.post(url, inventory_item);
    return { data: inventoryData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "changing inventory details failed",
    };
  }
}

async function getLocationDetails(shop, privateAppAPIKey, privateAppPassword) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/locations.json";
  let locationData;

  try {
    locationData = await axios.get(url);
    return { data: locationData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "getting location details failed",
    };
  }
}

async function captureTransaction(
  shop,
  privateAppAPIKey,
  privateAppPassword,
  order_id,
  transaction
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/orders/" +
    order_id +
    "/transactions.json";
  let transactionData;

  try {
    transactionData = await axios.post(url, transaction);
    return { data: transactionData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "capturing transaction failed",
    };
  }
}

async function getFulfillments(
  shop,
  privateAppAPIKey,
  privateAppPassword,
  order_id
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/orders/" +
    order_id +
    "/fulfillments.json";
  let fulfillmentData;

  try {
    fulfillmentData = await axios.get(url);
    return { data: fulfillmentData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "fetching fulfillments failed",
    };
  }
}

async function addFulfillments(
  shop,
  privateAppAPIKey,
  privateAppPassword,
  order_id,
  fulfillment
) {
  var url =
    "https://" +
    privateAppAPIKey +
    ":" +
    privateAppPassword +
    "@" +
    shop +
    "/admin/api/2021-01/orders/" +
    order_id +
    "/fulfillments.json";
  let fulfillmentData;

  try {
    fulfillmentData = await axios.post(url, fulfillment);
    return { data: fulfillmentData.data, status: 200 };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      msg: "fetching fulfillments failed",
    };
  }
}

module.exports = {
  addStore,
  getAccessTokenFromDB,
  getAccessTokenFromShopify,
  getProductsFromStore,
  addProductToStore,
  deleteProductFromStore,
  updateProductInStore,
  addProductImage,
  getOrdersFromShopifyStore,
  placeOrder,
  getProductsFromShopifyStorePrivateApp,
  addProductIntoShopifyStorePrivateApp,
  getInventoryDetailsFromShopifyStore,
  changeInventoryDetailsInShopifyStore,
  getLocationDetails,
  captureTransaction,
  getFulfillments,
  addFulfillments,
};
