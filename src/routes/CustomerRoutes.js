module.exports = {
  '/customer': {
    get: {
      controller: 'CustomerController',
      method: 'getCustomer',
      auth: 'jwt',
      access: ['User']
    },
    put: {
      controller: 'CustomerController',
      method: 'updateCustomer',
      auth: 'jwt',
      access: ['User']
    }
  },
  '/customers': {
    post: {
      controller: 'CustomerController',
      method: 'createCustomer'
    }
  },
  '/customers/login': {
    post: {
      controller: 'CustomerController',
      method: 'loginCustomer'
    }
  },
  '/customers/address': {
    put: {
      controller: 'CustomerController',
      method: 'updateCustomerAddress',
      auth: 'jwt',
      access: ['User']
    }
  },
  '/customers/creditCard': {
    put: {
      controller: 'CustomerController',
      method: 'updateCustomerCreditCard',
      auth: 'jwt',
      access: ['User']
    }
  }
}