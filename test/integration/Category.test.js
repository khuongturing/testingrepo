const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Category', function category() {
  it('get category list', async function() {
    const response = await chai.request(app).get(`${baseUrl}/categories?page=1&limit=20`)
    expect(response.body.rows).eql(data.CATEGORIES)
  })

  it('get category', async function() {
    const category = data.CATEGORIES[0]
    const response = await chai.request(app).get(`${baseUrl}/categories/${category.category_id}`)
    expect(response.body).eql(category)
  })

  it('get category in product', async function() {
    const product = data.PRODUCTS[0]
    const response = await chai.request(app).get(`${baseUrl}/categories/inProduct/${product.product_id}`)
    expect(response.body).eql(data.CATEGORIES_IN_PRODUCT)
  })

  it('get category in department', async function() {
    const department = data.DEPARTMENTS[0]
    const response = await chai.request(app).get(`${baseUrl}/categories/inDepartment/${department.department_id}`)
    expect(response.body).eql(data.CATEGORIES_IN_DEPARTMENT)
  })
})