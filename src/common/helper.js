/**
 * Common helper functions
 */
const config = require('config')
const { setCache } = require('../services/CacheService')
/**
 * Decorator which catches all errors and processess results. It wraps all functions of a controller with a try/catch and forwards any errors to the express error middleware.
 * This avoids duplicating try/catch statements in every controller function
 * @param {Array} listOfFunctions 
 */
function wrapControllerFunctions(listOfFunctions) {
  return listOfFunctions.map((fn) => {
    if(fn.constructor.name === 'AsyncFunction') {
      return async function(req, res, next) {
        try {
          const result = await fn(req, res) // Call the controller function
          if(result) {
            if(result instanceof Error) {
              throw result
            }
            const shouldSetCache = req[config.get('CACHE.SET_CACHE')] // To store in cache or not
            // msql results have a format of [[results], [metadata]]. So return only the first element of the array
            if(Array.isArray(result)) {
              if(shouldSetCache) {
                setCache(req.url, result[0]) // Store in cache
              }
              res.json(result[0])
            } else {
              if(shouldSetCache) {
                setCache(req.url, result) // Store in cache
              }
              // If just an object
              res.json(result)
            }
          } else {
            res.sendStatus(200)
          }
        } catch (err) {
          next(err)
        }
      }
    }
    return fn
  })
}

module.exports = {
  wrapControllerFunctions
}