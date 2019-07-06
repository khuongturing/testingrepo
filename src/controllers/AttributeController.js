const errors = require('common-errors')
const AttributeService = require('../services/AttributeService')

async function getAttributes() {
  return await AttributeService.getAttributes()
}

async function getAttribute(req) {
  // Return an error object if the attribute is not found
  const attribute = (await AttributeService.getAttribute(req.params.attribute_id))[0][0] || (new errors.HttpStatusError(404, `Attribute with id ${req.params.attribute_id} was not found`))
  return attribute
}

async function getValuesForAttribute(req) {
  return await AttributeService.getValuesForAttribute(req.params.attribute_id)
}

async function getAttributesInProduct(req) {
  return await AttributeService.getAttributesInProduct(req.params.product_id)
}

module.exports = {
  getAttribute,
  getAttributes,
  getValuesForAttribute,
  getAttributesInProduct
}