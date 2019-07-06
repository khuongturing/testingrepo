/**
 * Initialize application and load routes
 */
const config = require('config')
// Initialize datadog tracer before other modules if enabled
let ddTrace = null
if(config.get('ENABLE_DATADOG_APM')) {
  ddTrace = require('dd-trace')
  ddTrace.init()
}

require('../services/CronService') // Start cron service
const fs = require('fs')
const path = require('path')
const util = require('util')
const Joi = require('joi')

const getParameterNames = require('get-parameter-names')
const logger = require('./logger')

/**
 * Convert array to object
 * @param {Array} keys the keys to give to array elements
 * @param {Array} arr the array with values
 * @private
 */
function arrayToObject (keys, arr) {
  const obj = {}
  arr.forEach((e, i) => {
    obj[keys[i]] = e
  })
  return obj
}

/**
 * Remove properties from the object and hide long arrays
 * @param {Object} obj the object
 * @returns {Object} the new object with removed properties
 * @private
 */
function sanitizeObject(obj) {
  const sensitiveKeys = config.get('LOG.DO_NOT_LOG_KEYS')
  sensitiveKeys.forEach((key) => {
    if(obj[key]) {
      obj[key] = '<removed>'
    }
  })

  for (let [key, value] of Object.entries(obj)) {
    if(Array.isArray(value) && value.length > 20) {
      obj[key] = `Array(${value.length})`
    }
  }
}

/**
 * Decorate all functions of a service and log debug information if DEBUG is enabled
 * @param {Object} service the service
 */
function decorateWithLogging(service) {
  const methodNames = Object.keys(service)
  methodNames.forEach((name) => {
    const method = service[name]
    service[name] = async function() {
      logger.debug(`ENTER ${name}`)
      logger.debug('Input arguments:')
      const args = [...arguments]
      logger.debug(util.inspect(sanitizeObject(arrayToObject(getParameterNames(method), args))))
      try {
        const result = await method.apply(this, args)
        logger.debug(`EXIT ${name}`)
        if(result) {
          logger.debug('Output arguments:')
          logger.debug(util.inspect(result))
        }
        return result
      } catch (e) {
        logger.error(util.inspect(e))
        throw e
      }
    }
  })
}

/**
 * Decorate all functions of a service and validate input values
 * and replace input arguments with sanitized result from Joi
 * Service method must have a `schema` property with Joi schema
 * @param {Object} service the service
 */
function decorateWithValidators(service) {
  const methodNames = Object.keys(service)
  methodNames.forEach((name) => {
    const method = service[name]
    if(!method.schema) {
      return
    }

    service[name] = function decorateWithValidators() {
      const args = [...arguments]
      const argumentsObject = arrayToObject(getParameterNames(method), args)
      Joi.attempt(argumentsObject, method.schema) // Validate function arguments
      return method.apply(this, args)
    }
  })
}

/**
 * Decorate services
 * @param {Object} service 
 */
function buildService(service) {
  decorateWithValidators(service)
  if(config.get('LOG.LOG_LEVEL') === 'debug') {
    decorateWithLogging(service)
  }
}

/**
 * Initialize all services in src/services
 * @param {String} dir 
 */
function buildServices (dir) {
  const EXCLUDE_DECORATING_SERVICES = config.get('EXCLUDE_DECORATING_SERVICES')
  
  fs.readdirSync(dir, { withFileTypes: true}).forEach((file) => {
    const filePath = path.join(dir, file.name)
    if(file.isDirectory()) {
      buildServices(filePath) // Recursively build directories
    } else if(path.extname(file.name) === '.js') {
      if(!EXCLUDE_DECORATING_SERVICES.includes(file.name)) {
        buildService(require(filePath))
      }
    }
  })
}

buildServices(path.join(__dirname, '..', 'services'))
