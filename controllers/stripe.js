import { config } from "dotenv";
import stripeAuth from "stripe";

config();
const stripe = stripeAuth(process.env.STRIPE_SECRET_KEY);
/**
 *
 *
 * @class Payment
 */
class Payment {
  /**
   *
   *
   * @static
   * @description charge a customer using stripe
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Payment
   */
  static charge(req, res) {
    const { stripeToken, order_id, description, amount, currency } = req.body;

    stripe.charges
      .create({
        amount,
        description,
        currency: currency || "usd",
        source: stripeToken
      })
      .then(charge => res.status(200).json({ charge }))
      .catch(error => console.log(error));
  }

  static webHooks(req, res) {}
}

export default Payment;
