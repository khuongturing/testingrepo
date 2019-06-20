import 'dotenv/config';
import stripe from 'stripe';
import emailTemplates from '../helpers/mail/emailTemplates';
import sendMail from '../helpers/mail/sendMail';
import errorResponse from '../helpers/errorResponse';
import Model from '../database/models';

const { Order } = Model;

const keySecret = process.env.STRIPE_SECRET_KEY;
const Stripe = stripe(keySecret);
const {
  confirmationTemplateHtml, confirmationTemplateText
} = emailTemplates;

/**
 *
 *
 * @export
 * @class StripeControlle
 * @description Payment with stripe
 */
export default class StripeController {
  /**
    * @description -This method charges on stripe
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - charge and message
    */
  static async payWithStripe(req, res) {
    const {
      order_id: orderId, description, amount, currency, stripeToken
    } = req.body;
    const { email } = req.user;
    try {
      const order = await Order.findOne({ where: { order_id: orderId, customer_id: req.user.id } });
      if (order && order.dataValues.status === 0) {
        const customer = await Stripe.customers.create({
          email,
          source: stripeToken
        });
        const charge = await Stripe.charges.create({
          amount,
          description,
          currency,
          customer: customer.id,
          metadata: { order_id: orderId },
        });
        await order.update({ status: 1 });
        sendMail({
          from: process.env.MAIL_SENDER,
          to: email,
          subject: 'Confirmation On Your Order',
          text: confirmationTemplateText(req.user.name, process.env.BASE_URL),
          html: confirmationTemplateHtml(req.user.name, process.env.BASE_URL)
        });
        res.status(200).json({ charge, message: 'Payment processed' });
      } else if (order && order.dataValues.status === 1) {
        return res.status(422).json({
          error: {
            status: 422,
            message: 'Order has already been completed',
            field: 'order id'
          }
        });
      } else {
        return res.status(404).json({
          error: {
            status: 404,
            message: 'Order id does not exist',
            field: 'order id'
          }
        });
      }
    } catch (error) {
      if (error.message.includes('Invalid API Key')) {
        return res.status(401).json({
          code: 'AUT_02',
          message: 'The apikey is invalid.',
          field: 'API-KEY'
        });
      }
      if (error.message.includes('You cannot use a Stripe token more than once')) {
        return res.status(500).json({
          code: 'resource_missing',
          message: `No such token: ${stripeToken}`,
          field: 'source'
        });
      }
      return res.status(500).json(errorResponse(req, res, 500, 'STR_500', error.message, ''));
    }
  }

  /**
    * @description -This method returns webhook from Stripe
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - webhook details
    */
  static async webhook(req, res) {
    return res.status(200).json({ received: true });
  }

  /**
    * @description -This method returns a Stripe token
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - get token
    */
  static async getToken(req, res) {
    try {
      const token = await Stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2020,
          cvc: '123'
        }
      });
      res.status(200).send({ stripeToken: token.id });
    } catch (error) {
      res.status(404).send({ error });
    }
  }
}
