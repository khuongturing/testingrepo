import 'dotenv/config';
import Model from '../database/models';
import Authenticator from '../middlewares/authenticator';

const { Customer } = Model;
const { generateToken } = Authenticator;

/**
 *
 *
 * @export
 * @class SocialLoginController
 * @description Login with social accounts
 */
export default class SocialLoginController {
  /**
   * @description - find or create customer
   * @param {object} profile
   * @param {function} done
   * @returns {object} cusotmer
   */
  static async findOrCreateCustomer(profile, done) {
    const newCustomer = {
      email: profile.email,
      name: profile.name
    };
    try {
      await Customer.findOrCreate({
        where: { email: newCustomer.email },
        defaults: { name: newCustomer.name, password: '12345' },
      }).spread((foundOrCreatedCustomer, created) => {
        const { customer_id: customerId, email, name } = foundOrCreatedCustomer.dataValues;
        done(null, {
          email, customerId, name, created,
        });
      });
    } catch (error) {
      done(null, null);
    }
  }

  /**
   * @description - callback function for passport strategy
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile
   * @param {function} done
   * @returns {json} json
   */
  static passportCallback(accessToken, refreshToken, profile, done) {
    const customerProfile = {
      email: profile.emails[0].value,
      name: profile.displayName
    };
    SocialLoginController.findOrCreateCustomer(customerProfile, done);
  }

  /**
    * @description returns a token for the customer
    * @static
    * @param {object} req
    * @param {object} res
    * @returns {json} json
  */
  static respondWithToken(req, res) {
    const { customerId, email, name } = req.user;
    const customer = { customerId, email, name };
    const token = generateToken(customer);
    if (req.user.created) {
      res.status(201).json({ customer, accessToken: `Bearer ${token}`, expires_in: process.env.TOKEN_EXPIRATION });
    }
    res.status(200).json({ customer, accessToken: `Bearer ${token}`, expires_in: process.env.TOKEN_EXPIRATION });
  }
}
