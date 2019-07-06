const crypto = require('crypto')
const config = require('config')
const Joi = require('joi')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Generate a unique 32 character string
 */
function generateUniqueId() {
  return {
    cart_id: crypto.randomBytes(16).toString('hex') // 32 characters
  }
}

/**
 * Add a product to the cart
 * @param {Object} productData 
 */
async function addProduct(productData) {
  const { cart_id, product_id, attributes } = productData
  await dbPool.query(`call ${STORED_PROCEDURES.ADD_PRODUCT_TO_SHOPPING_CART}(?, ?, ?)`, [cart_id, product_id, attributes])
  return getProducts(cart_id)
}
addProduct.schema = {
  productData: Joi.object().keys({
    cart_id: Joi.string().required(),
    product_id: Joi.number().integer().positive().required(),
    attributes: Joi.string().required()
  }).required()
}

/**
 * List all products in cart
 * @param {Number} cartId 
 */
function getProducts(cartId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCTS_IN_SHOPPING_CART}(?)`, cartId)
}
getProducts.schema = {
  cartId: Joi.string().required()
}

/**
 * Update item quantity in cart
 * @param {Number} itemId 
 * @param {Object} itemData 
 */
function updateItem(itemId, itemData) {
  const { quantity } = itemData
  return dbPool.query(`call ${STORED_PROCEDURES.UPDATE_ITEM_IN_SHOPPING_CART}(?, ?)`, [itemId, quantity])
}
updateItem.schema = {
  itemId: Joi.number().integer().positive().required(),
  itemData: Joi.object().keys({
    quantity: Joi.number().integer().positive().required()
  }).required()
}

/**
 * Remove all products from cart
 * @param {Number} cartId 
 */
function emptyCart(cartId) {
  return dbPool.query(`call ${STORED_PROCEDURES.EMPTY_SHOPPING_CART}(?)`, cartId)
}
emptyCart.schema = {
  cartId: Joi.string().required()
}

/**
 * Set buy = now and time of creation
 * @param {Number} itemId 
 */
function moveProductToCart(itemId) {
  return dbPool.query(`call ${STORED_PROCEDURES.MOVE_ITEM_TO_SHOPPING_CART}(?)`, itemId)
}
moveProductToCart.schema = {
  itemId: Joi.number().integer().positive().required()
}

/**
 * Get total cart amount
 * @param {Number} cartId 
 */
function getTotalCartAmount(cartId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_TOTAL_AMOUNT_IN_CART}(?)`, cartId)
}
getTotalCartAmount.schema = {
  cartId: Joi.string().required()
}

/**
 * Save product for later
 * @param {Number} itemId 
 */
function saveProductForLater(itemId) {
  return dbPool.query(`call ${STORED_PROCEDURES.SAVE_PRODUCT_FOR_LATER}(?)`, itemId)
}
saveProductForLater.schema = {
  itemId: Joi.number().integer().positive().required()
}

/**
 * Get all saved products in cart
 * @param {String} cartId 
 */
function getSavedProducts(cartId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_SAVED_PRODUCT_IN_CART}(?)`, cartId)
}
getSavedProducts.schema = {
  cartId: Joi.string().required()
}

/**
 * Remove a product from cart
 * @param {Number} itemId 
 */
function removeProductFromCart(itemId) {
  return dbPool.query(`call ${STORED_PROCEDURES.REMOVE_PRODUCT_IN_CART}(?)`, itemId)
}
removeProductFromCart.schema = {
  itemId: Joi.number().integer().positive().required()
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