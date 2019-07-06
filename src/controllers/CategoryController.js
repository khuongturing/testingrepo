const errors = require('common-errors')
const CategoryService = require('../services/CategoryService')

async function getCategories(req) {
  return await CategoryService.getCategories(req.query)
}

async function getCategory(req) {
  // Return an error object if the category is not found
  const category = (await CategoryService.getCategory(req.params.category_id))[0][0] || (new errors.HttpStatusError(404, `Category with id ${req.params.category_id} was not found`))
  return category
}

async function getCategoriesInProduct(req) {
  return await CategoryService.getCategoriesInProduct(req.params.product_id)
}

async function getCategoriesInDepartment(req) {
  return await CategoryService.getCategoriesInDepartment(req.params.department_id)
}

module.exports = {
  getCategories,
  getCategory,
  getCategoriesInProduct,
  getCategoriesInDepartment
}