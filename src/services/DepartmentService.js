const config = require('config')
const Joi = require('joi')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Get all departments
 */
function getDepartments() {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_DEPARTMENTS}`)
}

/**
 * Get specific department
 * @param {Number} departmentId 
 */
function getDepartment(departmentId) {
  return dbPool.query(`call ${STORED_PROCEDURES.GET_DEPARTMENT}(?)`, departmentId)
}
getDepartment.schema = {
  departmentId: Joi.number().integer().required()
}

module.exports = {
  getDepartments,
  getDepartment
}