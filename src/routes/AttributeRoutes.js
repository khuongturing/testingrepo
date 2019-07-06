const { getFromCache } = require('../services/CacheService')

module.exports = {
  '/attributes': {
    get: {
      controller: 'AttributeController',
      method: 'getAttributes',
      middleware: [getFromCache]
    }
  },
  '/attributes/:attribute_id': {
    get: {
      controller: 'AttributeController',
      method: 'getAttribute',
      middleware: [getFromCache]
    }
  },
  '/attributes/values/:attribute_id': {
    get: {
      controller: 'AttributeController',
      method: 'getValuesForAttribute',
      middleware: [getFromCache]
    }
  },
  '/attributes/inProduct/:product_id': {
    get: {
      controller: 'AttributeController',
      method: 'getAttributesInProduct',
      middleware: [getFromCache]
    }
  }
}