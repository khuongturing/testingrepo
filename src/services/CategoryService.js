const config = require('config')
const Joi = require('joi')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Get a list of categories
 * @param {Object} query 
 */
async function getCategories(query) {
  const { order = 'category_id', page = 1, limit = 20 } = query
  const rows = (await dbPool.query(`call ${STORED_PROCEDURES.GET_CATEGORIES}(?, ?, ?)`, [order, limit, ((page - 1) * limit)]))[0]
  return {
    count: rows.length,
    rows
  }
}
getCategories.schema = {
  query: Joi.object().keys({
    order: Joi.string().valid('category_id', 'name'),
    page: Joi.number().integer().positive(),
    limit: Joi.number().integer().positive()
  }).required()
}

/**
 * Get a specific category
 * @param {Number} categoryId 
 */
function getCategory(categoryId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_CATEGORY}(?)`, categoryId)
}
getCategory.schema = {
  categoryId: Joi.number().integer()
}

/**
 * Get categories in product
 * @param {Number} productId 
 */
function getCategoriesInProduct(productId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_CATEGORIES_IN_PRODUCT}(?)`, productId)
}
getCategoriesInProduct.schema = {
  productId: Joi.number().integer()
}

/**
 * Get categories in department
 * @param {Number} departmentId 
 */
function getCategoriesInDepartment(departmentId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_CATEGORIES_IN_DEPARTMENT}(?)`, departmentId)
}
getCategoriesInProduct.schema = {
  productId: Joi.number().integer()
}

module.exports = {
  getCategories,
  getCategory,
  getCategoriesInProduct,
  getCategoriesInDepartment
}