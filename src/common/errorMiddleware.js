/**
 * Common error handling middleware
 */
const util = require('util')
const logger = require('./logger')
/**
 * The express error middleware function
 *
 * @param  {Object}     err       the error that is thrown in the application
 * @param  {Object}     req       the express request instance
 * @param  {Object}     res       the express response instance
 * @param  {Function}   next      the next middleware in the chain
 */
function middleware (err, req, res, next) { // eslint-disable-line no-unused-vars
  logger.error(util.inspect(err))
  // Errors from failed joi validation have err.isJoi set to true
  if (err.isJoi) {
    return res.status(400).json({
      message: err.details[0].message
    })
  } 
  const errorResult = {
    message: err.message
  }
  if(err.code) {
    errorResult.code = err.code
  }
  return res.status(err.statusCode || 500).json(errorResult)
}

module.exports = () => middleware
