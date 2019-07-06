const ShoppingCartService = require('../services/ShoppingCartService')

async function generateUniqueId() {
  return await ShoppingCartService.generateUniqueId()
}

async function addProduct(req) {
  return await ShoppingCartService.addProduct(req.body)
}

async function getProducts(req) {
  return await ShoppingCartService.getProducts(req.params.cart_id)
}

async function updateItem(req) {
  await ShoppingCartService.updateItem(req.params.item_id, req.body)
}

async function emptyCart(req) {
  await ShoppingCartService.emptyCart(req.params.cart_id)
  return [[]] // Return an empty array as specified in the swagger docs
}

async function moveProductToCart(req) {
  await ShoppingCartService.moveProductToCart(req.params.item_id)
}

async function getTotalCartAmount(req) {
  return (await ShoppingCartService.getTotalCartAmount(req.params.cart_id))[0][0]
}

async function saveProductForLater(req) {
  await ShoppingCartService.saveProductForLater(req.params.item_id)
}

async function getSavedProducts(req) {
  return await ShoppingCartService.getSavedProducts(req.params.cart_id)
}

async function removeProductFromCart(req) {
  await ShoppingCartService.removeProductFromCart(req.params.item_id)
}

module.exports = {
  generateUniqueId,
  addProduct,
  getProducts,
  updateItem,
  emptyCart,
  moveProductToCart,
  getTotalCartAmount,
  saveProductForLater,
  getSavedProducts,
  removeProductFromCart
}