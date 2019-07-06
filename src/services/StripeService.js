const config = require('config')
const Stripe = require('stripe')
const errors = require('common-errors')
const nodemailer = require('nodemailer')
const Joi = require('joi')
const util = require('util')
const OrderService = require('./OrderService')
const CustomerService = require('./CustomerService')
const logger = require('../common/logger')

// Initialize stripe object
const stripe = new Stripe(config.get('STRIPE.SECRET_KEY'))
// Initialize nodemailer. Mails are sent from gmail to a customers email id.
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.get('EMAIL.USER'),
    pass: config.get('EMAIL.PASSWORD')
  }
})

/**
 * Create a charge for stripe
 * @param {Object} chargeData 
 */
async function createCharge(chargeData) {
  const { stripeToken, order_id, description, amount, currency = 'usd'} = chargeData
  // Ensure order exists
  const order = (await OrderService.getOrderDetail(order_id))[0][0] 
  if(!order) {
    throw new errors.HttpStatusError(404, `Order with id ${order_id} was not found`)
  }
  return stripe.charges.create({
    amount,
    description,
    currency,
    source: stripeToken,
    metadata: {
      order_id // Store order id for further processing in webhook
    }
  })
}
createCharge.schema = {
  chargeData: Joi.object().keys({
    stripeToken: Joi.string().required(),
    order_id: Joi.number().integer().required(),
    description: Joi.string().required(),
    amount: Joi.number().integer().required(),
    currency: Joi.string().required()
  }).required()
}

/**
 * Webhook to handle events from Stripe
 * @param {Object} event 
 */
async function handleWebhookEvents(event) {
  try {
    const eventData = event.data.object
    if(eventData.object === config.get('STRIPE.CHARGE_EVENT') && eventData.status === config.get('STRIPE.CHARGE_STATUS.SUCCEEDED')) {
      // Send email to customer
      const orderId = eventData.metadata.order_id
      const order = (await OrderService.getOrderInfo(orderId))[0][0]
      if(!order) {
        throw new errors.HttpStatusError(404, `Order with id ${orderId} was not found`)
      }

      const customer = await CustomerService.getCustomer(order.customer_id)
      if(!customer) {
        throw new errors.HttpStatusError(404, `Order with id ${order.customer_id} was not found`)
      }
      
      const mailOptions = {
        from: config.get('EMAIL.USER'),
        to: customer.email,
        subject: 'Stripe payment successful',
        text: `Your payment for order id ${orderId} was successful!`
      }
      await mailTransporter.sendMail(mailOptions)
      logger.info(`Mail sent to ${customer.email}`)
    }
  } catch(err) {
    logger.error(util.inspect(err))
  }
}


module.exports = {
  createCharge,
  handleWebhookEvents
}