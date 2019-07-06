const { getFromCache } = require('../services/CacheService')

module.exports = {
  '/shipping/regions': {
    get: {
      controller: 'ShippingController',
      method: 'getShippingRegions',
      middleware: [getFromCache]
    }
  },
  '/shipping/regions/:shipping_region_id': {
    get: {
      controller: 'ShippingController',
      method: 'getShippingRegion',
      middleware: [getFromCache]
    }
  }
}