const StripeService = require('../services/StripeService')

async function createCharge(req) {
  await StripeService.createCharge(req.body)
}

async function handleWebhookEvents(req) {
  await StripeService.handleWebhookEvents(req.body)
}

module.exports = {
  createCharge,
  handleWebhookEvents
}