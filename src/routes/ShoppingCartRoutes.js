module.exports = {
  '/shoppingcart/generateUniqueId': {
    get: {
      controller: 'ShoppingCartController',
      method: 'generateUniqueId'
    }
  },
  '/shoppingcart/add': {
    post: {
      controller: 'ShoppingCartController',
      method: 'addProduct'
    }
  },
  '/shoppingcart/:cart_id': {
    get: {
      controller: 'ShoppingCartController',
      method: 'getProducts'
    }
  },
  '/shoppingcart/update/:item_id': {
    put: {
      controller: 'ShoppingCartController',
      method: 'updateItem'
    }
  },
  '/shoppingcart/empty/:cart_id': {
    delete: {
      controller: 'ShoppingCartController',
      method: 'emptyCart'
    }
  },
  '/shoppingcart/moveToCart/:item_id': {
    get: {
      controller: 'ShoppingCartController',
      method: 'moveProductToCart'
    }
  },
  '/shoppingcart/totalAmount/:cart_id': {
    get: {
      controller: 'ShoppingCartController',
      method: 'getTotalCartAmount'
    }
  },
  '/shoppingcart/saveForLater/:item_id': {
    get: {
      controller: 'ShoppingCartController',
      method: 'saveProductForLater'
    }
  },
  '/shoppingcart/getSaved/:cart_id': {
    get: {
      controller: 'ShoppingCartController',
      method: 'getSavedProducts'
    }
  },
  '/shoppingcart/removeProduct/:item_id': {
    delete: {
      controller: 'ShoppingCartController',
      method: 'removeProductFromCart'
    }
  }
}