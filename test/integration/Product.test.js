require('./Customer.test') // Execute first to get create customer token
const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Product', function product() {
  it('get product list', async function() {
    const response = await chai.request(app).get(`${baseUrl}/products?page=1&limit=10&description_length=20`)
    expect(response.body.rows).eql(data.PRODUCTS)
  })

  it('search products', async function() {
    const response = await chai.request(app).get(`${baseUrl}/products/search?page=1&limit=10&description_length=20&query_string=shirt&all_words=on`)
    expect(response.body.rows).eql(data.SEARCH_PRODUCTS)
  })

  it('get product by id', async function() {
    const product = data.PRODUCT_BY_ID
    const response = await chai.request(app).get(`${baseUrl}/products/${product.product_id}`)
    expect(response.body).eql(product)
  })

  it('get product details by id', async function() {
    const product = data.PRODUCT_DETAILS
    const response = await chai.request(app).get(`${baseUrl}/products/${product.product_id}/details`)
    expect(response.body).eql(product)
  })

  it('get product locations by id', async function() {
    const product = data.PRODUCT_BY_ID
    const response = await chai.request(app).get(`${baseUrl}/products/${product.product_id}/locations`)
    expect(response.body).eql(data.PRODUCT_LOCATIONS)
  })

  it('create product review', async function() {
    const accessToken = (await chai.request(app).post(`${baseUrl}/customers/login`).send(data.CUSTOMER_CREDENTIALS)).body.accessToken
    const product = data.PRODUCT_BY_ID
    const response = await chai.request(app).post(`${baseUrl}/products/${product.product_id}/reviews`).set('Authorization', `Bearer ${accessToken}`).send({
      'product_id': product.product_id,
      'review': 'Great product',
      'rating': 5
    })
    expect(response.status).eql(200)
  })
})