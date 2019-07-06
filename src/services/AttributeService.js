const config = require('config')
const Joi = require('joi')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Return all attributes
 */
function getAttributes() {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ATTRIBUTES}`)
}

/**
 * Return a specific attribute
 * @param {Number} attributeId 
 */
function getAttribute(attributeId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ATTRIBUTE}(?)`, attributeId)
}
getAttribute.schema = {
  attributeId: Joi.number().integer().positive().required()
}

/**
 * Return attribute values
 * @param {Number} attributeId 
 */
function getValuesForAttribute(attributeId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ATTRIBUTE_VALUES}(?)`, attributeId)
}
getValuesForAttribute.schema = {
  attributeId:  Joi.number().integer().positive().required()
}

/**
 * Return attributes in a product
 * @param {Number} productId 
 */
function getAttributesInProduct(productId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_ATTRIBUTES_IN_PRODUCT}(?)`, productId)
}
getAttributesInProduct.schema = {
  productId:  Joi.number().integer().positive().required()
}

module.exports = {
  getAttributes,
  getAttribute,
  getValuesForAttribute,
  getAttributesInProduct
}