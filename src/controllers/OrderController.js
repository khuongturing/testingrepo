const errors = require('common-errors')
const OrderService = require('../services/OrderService')

async function createOrder(req) {
  return await OrderService.createOrder(req.authUser.userId, req.body)
}

async function getOrder(req) {
  // Return an error object if the order is not found
  const order = (await OrderService.getOrder(req.params.order_id))[0][0] || (new errors.HttpStatusError(404, `Order with id ${req.params.order_id} was not found`))
  return order
}

async function getOrdersInCustomer(req) {
  return await OrderService.getOrdersInCustomer(req.authUser.userId)
}

async function getOrderDetail(req) {
  // Return an error object if the order is not found
  const orderDetail = (await OrderService.getOrderDetail(req.params.order_id))[0][0] || (new errors.HttpStatusError(404, `Order with id ${req.params.order_id} was not found`))
  return orderDetail
}

module.exports = {
  createOrder,
  getOrder,
  getOrdersInCustomer,
  getOrderDetail
}
