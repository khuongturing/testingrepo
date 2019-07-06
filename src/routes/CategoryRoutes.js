const { getFromCache } = require('../services/CacheService')

module.exports = {
  '/categories': {
    get: {
      controller: 'CategoryController',
      method: 'getCategories',
      middleware: [getFromCache]
    }
  },
  '/categories/:category_id': {
    get: {
      controller: 'CategoryController',
      method: 'getCategory',
      middleware: [getFromCache]
    }
  },
  '/categories/inProduct/:product_id': {
    get: {
      controller: 'CategoryController',
      method: 'getCategoriesInProduct',
      middleware: [getFromCache]
    }
  },
  '/categories/inDepartment/:department_id': {
    get: {
      controller: 'CategoryController',
      method: 'getCategoriesInDepartment',
      middleware: [getFromCache]
    }
  }
}