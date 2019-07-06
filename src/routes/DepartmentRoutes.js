const { getFromCache } = require('../services/CacheService')

module.exports = {
  '/departments': {
    get: {
      controller: 'DepartmentController',
      method: 'getDepartments',
      middleware: [getFromCache]
    }
  },
  '/departments/:department_id': {
    get: {
      controller: 'DepartmentController',
      method: 'getDepartment',
      middleware: [getFromCache]
    }
  }
}