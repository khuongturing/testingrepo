import Stripe from 'stripe';
import dotenv from 'dotenv';
import { stripeErrorResponse } from '../utils/errors';
import { checkEmpty } from '../utils/helpers';


dotenv.config()

const SECRET = process.env.STRIPE_SECRET_KEY
const SIGN_IN_SECRET = process.env.STRIPE_SIGN_IN_SECRET
const STRIPE = new Stripe(SECRET)


/**
 * @description: A class containing all the StripePayment controllers
 *
 * @class: StripePayment
 *
 */
class StripePayment{

    /**
    * @description: This method ensures customers can make payment
    *
    * @method: stripeCharge
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    *
    * @return {object} response containing a charge object
    */
    static stripeCharge = async (req, res) => {
        try {
            const { amount, order_id, description, stripeToken } = req.body;
            const error = checkEmpty([
                { amount },
                { order_id },
                { description },
                { stripeToken },
            ])
            if (error) {
                return res.status(400).json(
                    errorResponse("STR_04", 400, error.message, error.name))
            }
            const charge = await STRIPE.charges.create({
                source: stripeToken,
                metadata: { order_id },
                description,
                amount,
                currency: 'USD',
            });
            res.status(201).json(charge)
        } catch (err) {
            if (err.param === "source" || err.param === "amount") {
                res.status(400).json(
                    stripeErrorResponse(err.code, err.message, err.param)
                )
            }
        }
    }

    /**
    * @description: This method ensures stripe is able to hit the route to relay a response.
    *
    * @method: stripeWebhook
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    *
    * @return {boolean} response containing boolean
    */
    static stripeWebhook = async (req, res) => {
        const sig = req.headers['stripe-signature']
        try {
            await STRIPE.webhooks.constructEvent(req.rawBody, sig, SIGN_IN_SECRET)
            return res.json({ received: true });
        } catch (err) {
            return res.status(400).json({ "Webhook Error": `${err.message}` })
        }
    }
}

export default StripePayment;
