const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Attributes', function attributes() {
  it('get attribute list', async function() {
    const response = await chai.request(app).get(`${baseUrl}/attributes`)
    expect(response.body).eql(data.ATTRIBUTES)
  })

  it('get attribute', async function() {
    const attribute = data.ATTRIBUTES[0]
    const response = await chai.request(app).get(`${baseUrl}/attributes/${attribute.attribute_id}`)
    expect(response.body).eql(attribute)
  })

  it('get attribute values', async function() {
    const attribute = data.ATTRIBUTES[0]
    const response = await chai.request(app).get(`${baseUrl}/attributes/values/${attribute.attribute_id}`)
    expect(response.body).eql(data.ATTRIBUTE_VALUES)
  })

  it('get attributes in product id', async function() {
    const productId = data.PRODUCTS[0].product_id
    const response = await chai.request(app).get(`${baseUrl}/attributes/inProduct/${productId}`)
    expect(response.body).eql(data.ATTRIBUTES_IN_PRODUCT)
  })
})