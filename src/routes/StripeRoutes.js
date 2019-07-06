module.exports = {
  '/stripe/charge': {
    post: {
      controller: 'StripeController',
      method: 'createCharge'
    }
  },
  '/stripe/webhooks': {
    post: {
      controller: 'StripeController',
      method: 'handleWebhookEvents'
    }
  }
}