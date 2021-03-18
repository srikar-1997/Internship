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

async function getAccessTokenFromShopify(
  accessTokenRequestURL,
  accessTokenPayLoad,
  shop
) {
  let accessTokenData = "";
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

async function getProductsFromStore(apiRequestURL, apiRequestHeader) {
  let productsData;
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

async function addProductToStore(apiRequestURL, apiRequestHeader, product) {
  let productsData;
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

async function deleteProductFromStore(apiRequestURL, apiRequestHeader) {
  let productsData;
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

async function updateProductTitleInStore(
  apiRequestURL,
  apiRequestHeader,
  product
) {
  let productsData;
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

async function addProductImage(apiRequestURL, apiRequestHeader, image) {
  let productsData;
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
  updateProductTitleInStore,
  addProductImage,
};
