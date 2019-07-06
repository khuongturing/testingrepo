const { getFromCache } = require('../services/CacheService')

module.exports = {
  '/tax': {
    get: {
      controller: 'TaxController',
      method: 'getTaxes',
      middleware: [getFromCache]
    }
  },
  '/tax/:tax_id': {
    get: {
      controller: 'TaxController',
      method: 'getTax',
      middleware: [getFromCache]
    }
  }
}