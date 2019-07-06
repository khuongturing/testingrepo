const CustomerService = require('../services/CustomerService')

async function getCustomer(req) {
  return await CustomerService.getCustomer(req.authUser.userId)
}

async function updateCustomer(req) {
  await CustomerService.updateCustomer(req.authUser.userId, req.body)
}

async function createCustomer(req) {
  return await CustomerService.createCustomer(req.body)
}

async function loginCustomer(req) {
  return await CustomerService.loginCustomer(req.body)
}

async function updateCustomerAddress(req) {
  await CustomerService.updateCustomerAddress(req.authUser.userId, req.body)
}

async function updateCustomerCreditCard(req) {
  await CustomerService.updateCustomerCreditCard(req.authUser.userId, req.body)
}


module.exports = {
  getCustomer,
  updateCustomer,
  createCustomer,
  loginCustomer,
  updateCustomerAddress,
  updateCustomerCreditCard
}