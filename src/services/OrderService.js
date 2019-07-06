const config = require('config')
const Joi = require('joi')
const errors = require('common-errors')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Create a new order
 * @param {Number} userId 
 * @param {Object} orderData 
 */
async function createOrder(userId, orderData) {
  const { cart_id, customer_id, shipping_id, tax_id } = orderData
  if(userId !== customer_id) {
    throw new errors.HttpStatusError(403, 'You are not authorized to perform this action')
  }
  const { orderId } = (await dbPool.query(`call ${STORED_PROCEDURES.CREATE_ORDER}(?, ?, ?, ?)`, [cart_id, customer_id, shipping_id, tax_id]))[0][0]
  return {
    order_id: orderId
  } 
}
createOrder.schema = {
  userId: Joi.number().integer().required(),
  orderData: Joi.object().keys({
    cart_id: Joi.string().required(),
    customer_id: Joi.number().integer().required(),
    shipping_id: Joi.number().integer().required(),
    tax_id: Joi.number().integer().required()
  }).required()
}

/**
 * Get specific order
 * @param {Number} orderId 
 */
function getOrder(orderId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ORDER_DETAILS}(?)`, orderId)
}
getOrder.schema = {
  orderId: Joi.number().integer().positive().required()
}

/**
 * Get customers orders
 * @param {Number} customerId 
 */
function getOrdersInCustomer(customerId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ORDER_FOR_CUSTOMER}(?)`, customerId)
}
getOrdersInCustomer.schema = {
  customerId: Joi.number().integer().positive().required()
}

/**
 * Get order details for a customer
 * @param {Number} orderId 
 */
function getOrderDetail(orderId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ORDER_SHORT_DETAILS}(?)`, orderId)
}
getOrderDetail.schema = {
  orderId: Joi.number().integer().positive().required()
}

/**
 * Get information about an order
 * @param {Number} orderId 
 */
function getOrderInfo(orderId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ORDER_INFO}(?)`, orderId)
}
getOrderInfo.schema = {
  orderId: Joi.number().integer().positive().required()
}

module.exports = {
  createOrder,
  getOrder,
  getOrdersInCustomer,
  getOrderDetail,
  getOrderInfo
}