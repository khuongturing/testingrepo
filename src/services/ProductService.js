const config = require('config')
const Joi = require('joi')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Get list of products
 * @param {Object} query 
 */
async function getProducts(query) {
  const { page = 1, limit = 20, descriptionLength = 200 } = query 
  const rows = (await dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCTS}(?, ?, ?)`, [descriptionLength, limit, ((page - 1) * limit)]))[0]
  return {
    count: rows.length,
    rows
  }
}
getProducts.schema = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().positive(),
    description_length: Joi.number().integer().positive()
  }).required()
}

/**
 * Search for a specified key word
 * @param {Object} query 
 */
async function searchProducts(query) {
  const { query_string, all_words = 'on', page = 1, limit = 20, descriptionLength = 200 } = query
  const rows = (await dbPool.query(`call ${STORED_PROCEDURES.SEARCH_PRODUCTS}(?, ?, ?, ?, ?)`, [query_string, all_words, descriptionLength, limit, ((page - 1) * limit)]))[0]
  return {
    count: rows.length,
    rows
  }
}
searchProducts.schema = {
  query: Joi.object().keys({
    query_string: Joi.string().required(),
    all_words: Joi.string().valid('on', 'off'),
    page: Joi.number().integer().positive(),
    limit: Joi.number().integer().positive(),
    description_length: Joi.number().integer().positive()
  }).required()
}

/**
 * Get a specific product by id
 * @param {Number} productId 
 */
function getProduct(productId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCT}(?)`, productId)
}
getProduct.schema = {
  productId: Joi.number().integer().required()
}

/**
 * Get all products in category
 * @param {Number} categoryId 
 * @param {Object} query 
 */
async function getProductsInCategory(categoryId, query) {
  const { descriptionLength = 200, page = 1, limit = 20 } = query
  const rows = (await dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCTS_IN_CATEGORY}(?, ?, ?, ?)`, [categoryId, descriptionLength, limit, ((page - 1) * limit)]))[0]
  return {
    count: rows.length,
    rows
  }
}
getProductsInCategory.schema = {
  categoryId: Joi.number().positive().required(),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().positive(),
    description_length: Joi.number().integer().positive()
  }).required()
}

/**
 * Get products in department
 * @param {Number} departmentId 
 * @param {Object} query 
 */
async function getProductsInDepartment(departmentId, query) {
  const { description_length = 200, page = 1, limit = 20 } = query
  const rows = (await dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCTS_IN_DEPARTMENT}(?, ?, ?, ?)`, [departmentId, description_length, limit, ((page - 1) * limit)]))[0]
  return {
    count: rows.length,
    rows
  }
}
getProductsInCategory.schema = {
  categoryId: Joi.number().positive().required(),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().positive(),
    description_length: Joi.number().integer().positive()
  }).required()
}

/**
 * Get details about a product
 * @param {Number} productId 
 */
function getProductDetails(productId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCT_DETAILS}(?)`, productId)
}
getProductDetails.schema = {
  productId: Joi.number().integer().required()
}

/**
 * Get category and department of a product
 * @param {Number} productId 
 */
function getProductLocations(productId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCT_LOCATIONS}(?)`, productId)
}
getProductLocations.schema = {
  productId: Joi.number().integer().required()
}

/**
 * Get all reviews
 * @param {Number} productId 
 */
function getProductReviews(productId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_PRODUCT_REVIEWS}(?)`, productId)
}
getProductReviews.schema = {
  productId: Joi.number().integer().required()
}

/**
 * Create review for a product
 * @param {Number} customerId 
 * @param {Object} reviewData 
 */
function createProductReview(customerId, reviewData) {
  const { product_id, review, rating } = reviewData
  return dbPool.query(`call ${STORED_PROCEDURES.CREATE_PRODUCT_REVIEW}(?, ?, ?, ?)`, [customerId, product_id, review, rating])
}
createProductReview.schema = {
  customerId: Joi.number().integer().positive().required(),
  reviewData: Joi.object().keys({
    product_id: Joi.number().integer().positive().required(),
    review: Joi.string().required(),
    rating: Joi.number().integer().positive().required()
  }).required()
}

module.exports = {
  getProducts,
  searchProducts,
  getProduct,
  getProductsInCategory,
  getProductsInDepartment,
  getProductDetails,
  getProductLocations,
  getProductReviews,
  createProductReview
}