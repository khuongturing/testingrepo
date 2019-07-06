const config = require('config')
const Joi = require('joi')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Get all shipping regions
 */
function getShippingRegions() {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_SHIPPING_REGIONS}`)
}

/**
 * Get a specific region
 * @param {Number} shipping_region_id 
 */
function getShippingRegion(shipping_region_id) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_SHIPPING_REGION}(?)`, shipping_region_id)
}
getShippingRegion.schema = {
  shipping_region_id: Joi.number().integer().required()
}

module.exports = {
  getShippingRegions,
  getShippingRegion
}