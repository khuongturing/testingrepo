const chai = require('chai')
const AttributeService = require('../../src/services/AttributeService')
const data = require('../data')

const expect = chai.expect

describe('Attributes', function attributes() {
  it('get attribute list', async function() {
    const response = await AttributeService.getAttributes()
    expect(response).eql(data.ATTRIBUTES)
  })

  it('get attribute', async function() {
    const attribute = data.ATTRIBUTES[0]
    const response = await AttributeService.getAttribute(attribute.attribute_id)
    expect(response).eql(attribute)
  })

  it('get attribute values', async function() {
    const attribute = data.ATTRIBUTES[0]
    const response = await AttributeService.getValuesForAttribute(attribute.attribute_id)
    expect(response).eql(data.ATTRIBUTE_VALUES)
  })

  it('get attributes in product id', async function() {
    const productId = data.PRODUCTS[0].product_id
    const response = await AttributeService.getAttributesInProduct(productId)
    expect(response).eql(data.ATTRIBUTES_IN_PRODUCT)
  })
})