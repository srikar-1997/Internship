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

module.exports = {
  addStore,
  getAccessTokenFromDB,
  getAccessTokenFromShopify,
  getProductsFromStore,
  addProductToStore,
  deleteProductFromStore,
  updateProductInStore,
  addProductImage,
};
