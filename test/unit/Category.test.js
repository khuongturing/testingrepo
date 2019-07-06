const chai = require('chai')
const CategoryService = require('../../src/services/CategoryService')
const data = require('../data')
const expect = chai.expect

describe('Category', function category() {
  it('get category list', async function() {
    const response = await CategoryService.getCategories({
      page: 1,
      limit: 20
    })
    expect(response.rows).eql(data.CATEGORIES)
  })

  // it('get category', async function() {
  //   const category = data.CATEGORIES[0]
  //   const response = await chai.request(app).get(`${baseUrl}/categories/${category.category_id}`)
  //   expect(response.body).eql(category)
  // })

  // it('get category in product', async function() {
  //   const product = data.PRODUCTS[0]
  //   const response = await chai.request(app).get(`${baseUrl}/categories/inProduct/${product.product_id}`)
  //   expect(response.body).eql(data.CATEGORIES_IN_PRODUCT)
  // })

  // it('get category in department', async function() {
  //   const department = data.DEPARTMENTS[0]
  //   const response = await chai.request(app).get(`${baseUrl}/categories/inDepartment/${department.department_id}`)
  //   expect(response.body).eql(data.CATEGORIES_IN_DEPARTMENT)
  // })
})