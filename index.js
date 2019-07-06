/**
 * The application entry point
 */
require('./src/common/bootstrap')
const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const errors = require('common-errors')
const authenticator = require('tc-core-library-js').middleware.jwtAuthenticator

const routes = require('./src/routes')
const errorMiddleware = require('./src/common/errorMiddleware')
const logger = require('./src/common/logger')
const helper = require('./src/common/helper')

const app = express()
if(config.get('REQUEST_THROTTLING.ENABLE')) {
  const rateLimit = require('express-rate-limit')
  // @ts-ignore
  const limiter = rateLimit({
    window: config.get('REQUEST_THROTTLING.WINDOW'),
    max: config.get('REQUEST_THROTTLING.NUMBER_OF_REQUESTS_IN_WINDOW'),
    message: {
      message: 'Too many requests, please try again later.'
    }
  })
  app.use(limiter)
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()

/**
 * Check if "arr" contains any element from "values"
 * @param {Array} arr 
 * @param {String|Array} values 
 */
function arrayContains(arr, values) {
  if(typeof values === 'string' || values instanceof String) {
    values = values.split(' ')
  }
  const intersection = arr.filter((e) => values.includes(e))
  if(intersection.length === 0) {
    return false
  }
  return true
}

// Read all routes and create handler functions for each route in express router
for(let [uri, httpMethods] of Object.entries(routes)) {
  for(let [httpMethod, operation] of Object.entries(httpMethods)) {
    let actions = [(req, res, next) => {
      // Set signature for logging
      req.signature = `${operation.controller}#${operation.method}`
      next()
    }]

    const handler = require(`./src/controllers/${operation.controller}`)[ operation.method]
    if(!handler) {
      throw new Error(`${operation.method} is undefined, for controller ${operation.controller}`)
    }

    // add Authenticator check if route has auth
    if(operation.auth) {
      actions.push((req, res, next) => {
        // authenticator validates jwt and creates "req.authUser"
        authenticator({
          AUTH_SECRET: config.get('JWT.AUTH_SECRET'),
          VALID_ISSUERS: config.get('JWT.VALID_ISSUERS')
        })(req, res, next)
      })

      actions.push((req, res, next) => {
        if(!req.authUser) {
          return next(new errors.HttpStatusError(401, 'Authentication required!'))
        }
        // Roles: User and Administrator should match current user's access level
        if(req.authUser.roles) {
          if(!arrayContains(operation.access, req.authUser.roles)) {
            return next(new errors.HttpStatusError(403, 'You are not authorized to perform this action!'))
          }
          return next()
        }

        // If no roles, then route should not have access level controls
        if(Array.isArray(operation.access) && operation.access.length > 0) {
          return next(new errors.HttpStatusError(403, 'You are not authorized to perform this action'))
        }

        return next()
      })
    }
    if(operation.middleware && operation.middleware.length > 0) {
      actions = actions.concat(operation.middleware)
    }
    
    actions.push(handler)
    // All routes have format "/v1/xxx"
    router[httpMethod](`/${config.get('SERVER.API_VERSION')}${uri}`, helper.wrapControllerFunctions(actions))
  }
}

app.use('/', router)
app.use(errorMiddleware())

// Check if the route is not found or HTTP method is not supported
app.use('*', (req, res) => {
  const pathKey = req.baseUrl.substring(config.get('SERVER.API_VERSION').length)
  const route = routes[pathKey]
  if (route) {
    return res.status(405).json({ message: 'The requested HTTP method is not supported.' })
  } 
  return res.status(404).json({ message: 'The requested resource cannot be found.' })
})

app.listen(config.get('SERVER.PORT'), () => {
  logger.info(`Express server listening on port ${config.get('SERVER.PORT')}`)
})

module.exports = app