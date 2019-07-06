const errors = require('common-errors')
const ProductService = require('../services/ProductService')

async function getProducts(req) {
  return await ProductService.getProducts(req.query)
}

async function searchProducts(req) {
  return await ProductService.searchProducts(req.query)
}

async function getProduct(req) {
  // Return an error object if the product is not found
  const product = (await ProductService.getProduct(req.params.product_id))[0][0] || (new errors.HttpStatusError(404, `Product with id ${req.params.product_id} was not found`))
  return product 
}

async function getProductsInCategory(req) {
  return await ProductService.getProductsInCategory(req.params.category_id, req.query)
}

async function getProductsInDepartment(req) {
  return await ProductService.getProductsInDepartment(req.params.department_id, req.query)
}

async function getProductDetails(req) {
  // Return an error object if the product is not found
  const details = (await ProductService.getProductDetails(req.params.product_id))[0][0] || (new errors.HttpStatusError(404, `Product with id ${req.params.product_id} was not found`))
  return details 
}

async function getProductLocations(req) {
  return await ProductService.getProductLocations(req.params.product_id)
}

async function getProductReviews(req) {
  return await ProductService.getProductReviews(req.params.product_id)
}

async function createProductReview(req) {
  await ProductService.createProductReview(req.authUser.userId, req.body)
}

module.exports = {
  getProducts,
  getProduct,
  getProductDetails,
  getProductLocations,
  getProductReviews,
  searchProducts,
  getProductsInCategory,
  getProductsInDepartment,
  createProductReview
}