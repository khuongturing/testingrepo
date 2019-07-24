/**
 * Customer controller handles all requests that has to do with customer
 * Some methods needs to be implemented from scratch while others may contain one or two bugs
 * 
 * - create - allow customers to create a new account
 * - login - allow customers to login to their account
 * - getCustomerProfile - allow customers to view their profile info
 * - updateCustomerProfile - allow customers to update their profile info like name, email, password, day_phone, eve_phone and mob_phone
 * - updateCustomerAddress - allow customers to update their address info
 * - updateCreditCard - allow customers to update their credit card number
 * 
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import { Customer, sequelize } from '../database/models';
import Auth from '../auth/auth';
import FB, { FacebookApiException } from 'fb';

/**
 *
 *
 * @class CustomerController
 */
class CustomerController {

  /**
 * create a customer record
 *
 * @static
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} next next middleware
 * @returns {json} json object with status, customer data and access token
 * @memberof CustomerController
 */
  static async create(req, res, next) {
    // Implement the function to create the customer account
    try {
      const { name, email, password } = req.body;
      let cust = await Customer.findOne({ where: { email } });
      if (!cust) {
        Customer.create({ name, email, password }).then(function (inserted) {
          const { customer_id } = inserted.dataValues;
          Customer.findByPk(customer_id, { attributes: { exclude: ['password'] } }).then(function (customer) {
            Auth.authenticate(customer_id, function (accessToken, expiresIn) {
              return res.status(201).json({ customer, accessToken, expiresIn });
            });
          });
        });
      } else {
        return res.status(400).json({ error: { status: 400, code:'USR_04', message: 'The email already exists.', field: 'email' } });
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async login(req, res, next) {
    // implement function to login to user account
    try {
      const { email, password } = req.body;
      Customer.findOne({ where: { email } }).then(function (cust) {
        if (cust) {
          const { customer_id } = cust;
          if (cust.validatePassword(password)) {
            Customer.findByPk(customer_id, {
              attributes: {
                exclude: ['password'],
                include: [[sequelize.fn('RIGHT', sequelize.col('credit_card'), 4), 'credit_card']]
              }
            }).then(function (customer) {
              customer.credit_card = customer.credit_card ? 'xxxxxxxxxxxx' + customer.credit_card : customer.credit_card;
              Auth.authenticate(customer_id, function (accessToken, expiresIn) {
                return res.status(201).json({ customer, accessToken, expiresIn });
              });
            });
          } else {
            return res.status(400).json({ error: { status: 400, code:'USR_01', message: 'Email or Password is invalid.', field: 'email' } });
          }
        } else {
          return res.status(400).json({ error: { status: 400, code:'USR_01', message: 'Email or Password is invalid.', field: 'email' } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async facebook(req, res, next) {
    // implement function to login to user account
    try {
      const { access_token } = req.body;

      FB.setAccessToken(access_token);
      FB.api('me', { fields: 'id,name,email' }, async function (fbres) {
        if (!fbres || fbres.error) {
          return res.status(401).json(fbres);
        }
        let name = fbres.name;
        let email = fbres.email ? fbres.email : fbres.id + "@facebook.com";
        let password = fbres.id;

        let customer = await Customer.findOne({ where: { email } });
        if (customer) {
          const { customer_id } = customer;
          if (customer.validatePassword(password)) {
            customer = await Customer.findByPk(customer_id, {
              attributes: {
                exclude: ['password'],
                include: [[sequelize.fn('RIGHT', sequelize.col('credit_card'), 4), 'credit_card']]
              }
            });
            customer.credit_card = customer.credit_card ? 'xxxxxxxxxxxx' + customer.credit_card : customer.credit_card;
            Auth.authenticate(customer_id, function (accessToken, expiresIn) {
              return res.status(200).json({ customer, accessToken, expiresIn });
            });
          }
        } else {
          Customer.create({ name, email, password }).then(function (inserted) {
            const { customer_id } = inserted.dataValues;
            Customer.findByPk(customer_id, { attributes: { exclude: ['password'] } }).then(function (customer) {
              Auth.authenticate(customer_id, function (accessToken, expiresIn) {
                return res.status(200).json({ customer, accessToken, expiresIn });
              });
            });
          });
        }
      });
    } catch (error) {
      return next(error);
    }
  }


  /**
   * get customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async getCustomerProfile(req, res, next) {
    // fix the bugs in this code
    try {
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { customer_id } = result.decoded;
          Customer.findByPk(customer_id, {
            attributes: {
              exclude: ['password'],
              include: [[sequelize.fn('RIGHT', sequelize.col('credit_card'), 4), 'credit_card']]
            }
          }).then(function (customer) {
            customer.credit_card = customer.credit_card ? 'xxxxxxxxxxxx' + customer.credit_card : customer.credit_card;
            return res.status(200).json(customer);
          });
        } else {
          return res.status(401).json({ error: { status: 401, code: result.code, message: result.message, field: '' } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as name, email, password, day_phone, eve_phone and mob_phone
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerProfile(req, res, next) {
    // Implement function to update customer profile like name, day_phone, eve_phone and mob_phone
    try {
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { email, name, day_phone, eve_phone, mob_phone } = req.body;
          const { customer_id } = result.decoded;
          Customer.update({ email, name, day_phone, eve_phone, mob_phone }, { where: { customer_id } }).then(function (customer) {
            Customer.findByPk(customer_id, {
              attributes: {
                exclude: ['password'],
                include: [[sequelize.fn('RIGHT', sequelize.col('credit_card'), 4), 'credit_card']]
              }
            }).then(function (customer) {
              customer.credit_card = customer.credit_card ? 'xxxxxxxxxxxx' + customer.credit_card : customer.credit_card;
              return res.status(200).json(customer);
            });
          });
        } else {
          return res.status(401).json({ error: { status: 401, code: result.code, message: result.message, field: '' } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as address_1, address_2, city, region, postal_code, country and shipping_region_id
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerAddress(req, res, next) {
    // write code to update customer address info such as address_1, address_2, city, region, postal_code, country
    // and shipping_region_id
    try {
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { address_1, address_2, city, region, postal_code, shipping_region_id } = req.body;
          const { customer_id } = result.decoded;
          Customer.update({ address_1, address_2, city, region, postal_code, shipping_region_id }, { where: { customer_id } }).then(function (customer) {
            Customer.findByPk(customer_id, {
              attributes: {
                exclude: ['password'],
                include: [[sequelize.fn('RIGHT', sequelize.col('credit_card'), 4), 'credit_card']]
              }
            }).then(function (customer) {
              customer.credit_card = customer.credit_card ? 'xxxxxxxxxxxx' + customer.credit_card : customer.credit_card;
              return res.status(200).json(customer);
            });
          });
        } else {
          return res.status(401).json({ error: { status: 401, code: result.code, message: result.message, field: '' } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer credit card
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCreditCard(req, res, next) {
    // write code to update customer credit card number
    try {
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { credit_card } = req.body;
          const { customer_id } = result.decoded;
          Customer.update({ credit_card }, { where: { customer_id } }).then(function (customer) {
            Customer.findByPk(customer_id, {
              attributes: {
                exclude: ['password'],
                include: [[sequelize.fn('RIGHT', sequelize.col('credit_card'), 4), 'credit_card']]
              }
            }).then(function (customer) {
              customer.credit_card = customer.credit_card ? 'xxxxxxxxxxxx' + customer.credit_card : customer.credit_card;
              return res.status(200).json(customer);
            });
          });
        } else {
          return res.status(401).json({ error: { status: 401, code: result.code, message: result.message, field: '' } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default CustomerController;
