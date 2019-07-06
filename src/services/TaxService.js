const config = require('config')
const Joi = require('joi')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Get all taxes
 */
function getTaxes() {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_TAXES}`)
}

/**
 * Get specific tax
 * @param {Number} taxId 
 */
function getTax(taxId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_TAX}(?)`, taxId)
}
getTax.schema = {
  taxId: Joi.number().integer().required()
}

module.exports = {
  getTaxes,
  getTax
}