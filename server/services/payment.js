import stripe from 'stripe';
import { STRIPE_API_KEY } from 'src/config/constants';

const stripeApi = stripe(STRIPE_API_KEY);

export default {
  /**
   * @param {Object} paymentData - the paymentment data
   * @param {Object} paymentData.amount - the order total pay amount
   * @param {Object} paymentData.currency - selected currency
   * @param {Object} paymentData.receipt_email - selected currency
   * @returns {Object} - response returned from stripe
   */
  async makeOrderPayment({
    amount,
    currency,
    stripeToken,
    receiptEmail,
    order_id
  }) {
    const charge = await stripeApi.charges.create({
      amount,
      currency,
      source: stripeToken,
      receipt_email: receiptEmail,
      metadata: {
        order_id
      }
    });

    return charge;
  }
};
