module.exports = {
  '/orders/inCustomer': {
    get: {
      controller: 'OrderController',
      method: 'getOrdersInCustomer',
      auth: 'jwt',
      access: ['User']
    }
  },
  '/orders': {
    post: {
      controller: 'OrderController',
      method: 'createOrder',
      auth: 'jwt',
      access: ['User']
    }
  },
  '/orders/:order_id': {
    get: {
      controller: 'OrderController',
      method: 'getOrder',
      auth: 'jwt',
      access: ['User']
    }
  },
  '/orders/shortDetail/:order_id': {
    get: {
      controller: 'OrderController',
      method: 'getOrderDetail',
      auth: 'jwt',
      access: ['User']
    }
  }
}