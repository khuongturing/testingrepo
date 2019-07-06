const { getFromCache } = require('../services/CacheService')

module.exports = {
  '/products/search': {
    get: {
      controller: 'ProductController',
      method: 'searchProducts',
      middleware: [getFromCache]
    }
  },
  '/products': {
    get: {
      controller: 'ProductController',
      method: 'getProducts',
      middleware: [getFromCache]
    }
  },
  '/products/:product_id': {
    get: {
      controller: 'ProductController',
      method: 'getProduct',
      middleware: [getFromCache]
    }
  },
  '/products/inCategory/:category_id': {
    get: {
      controller: 'ProductController',
      method: 'getProductsInCategory',
      middleware: [getFromCache]
    }
  },
  '/products/inDepartment/:department_id': {
    get: {
      controller: 'ProductController',
      method: 'getProductsInDepartment',
      middleware: [getFromCache]
    }
  },
  '/products/:product_id/details': {
    get: {
      controller: 'ProductController',
      method: 'getProductDetails',
      middleware: [getFromCache]
    }
  },
  '/products/:product_id/locations': {
    get: {
      controller: 'ProductController',
      method: 'getProductLocations',
      middleware: [getFromCache]
    }
  },
  '/products/:product_id/reviews': {
    get: {
      controller: 'ProductController',
      method: 'getProductReviews'
    },
    post: {
      controller: 'ProductController',
      method: 'createProductReview',
      auth: 'jwt',
      access: ['User']
    }
  }
}