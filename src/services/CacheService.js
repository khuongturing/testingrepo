/**
 * In memory cache service
 */
const NodeCache = require('node-cache')
const config = require('config')
const cache = new NodeCache({
  stdTTL: config.get('CACHE.TTL'),
  checkperiod: config.get('CACHE.DELETE_CHECK_INTERVAL')
})

/**
 * Express middleware function
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
function getFromCache(req, res, next) {
  const cachedResult = cache.get(req.url)
  if(cachedResult) {
    // Return result if present
    return res.json(cachedResult)
  } else {
    // Set the SET_CACHE variable on req object so that the result is updated in cache by the decorators created in helper.js:wrapControllerFunctions
    req[config.get('CACHE.SET_CACHE')] = true
  }
  next()
}

/**
 * Set value in cache
 * @param {String} key 
 * @param {String|Object|Array|Number} value 
 */
function setCache(key, value) {
  cache.set(key, value)
}

module.exports = {
  getFromCache,
  setCache
}