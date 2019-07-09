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
import { Customer } from '../database/models';
let log = require('fancy-log')
let UtilityHelper = require('../lib/utilityHelper');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus');
let Response = require('../lib/responseManager')
let {create, login, update, update_address, update_credit_card} = require('../validators/customer.validator');
let {deletePassword, hashPassword} = require('../lib/helpers')
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
    let {body} = req;

    try{
      await create(res, body);
      let customer = await Customer.create(body);
      let tokenData = {
        id: customer.customer_id,
        email: customer.email
      };
      let accessToken = await UtilityHelper.generateToken(tokenData);
      delete customer.dataValues.password;
      log('Successfully Created new Customer');
      return Response.success(res, {customer, accessToken: `Bearer ${accessToken}`, expires_in: '24h'})
    }catch(error){
      log.error(`Error Creating Customer {err: ${error}}`);
      if(error.parent.errno === 1062) return Response.failure(res, responseMessages.EMAIL_EXISTS, HttpStatus.BAD_REQUEST,
        'email');
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
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
    try {
      let {body} = req;
      await login(res, body);
      let customer = await Customer.findOne({where: {email: body.email}});
      if(!customer) return Response.failure(res, responseMessages.EMAIL_NOT_EXISTS, HttpStatus.NOT_FOUND, 'email');

      let isValidPassword = await customer.validatePassword(body.password);
      if(!isValidPassword) return Response.failure(res, responseMessages.INVALID_EMAIL_PASSWORD, HttpStatus.BAD_REQUEST, ['email', 'password']);
      let tokenData = {
        id: customer.customer_id,
        email: customer.email
      };
      let accessToken = await UtilityHelper.generateToken(tokenData);
      delete customer.dataValues.password;
      log(`Login Successful for Customer ${customer.email}`);
      return Response.success(res, {customer, accessToken: `Bearer ${accessToken}`, expires_in: '24h'})
    }catch(error){
      console.log(error);
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
      let { customer_id } = req; 
      try{
        let customer = await Customer.findByPk(customer_id);
        customer = deletePassword(customer);
        return Response.success(res, {customer})
      }catch (error) {
      log.error(`Error Getting Customer Profile {err: ${error}}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
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
    let { customer_id, body } = req; 

    try {
      await update(res, body);
      if(body.password){
        let hashedPassword = await hashPassword(body.password);
        body.password = hashedPassword;
      }
      await Customer.update(body, {where: {customer_id}});
      let new_customer = await Customer.findByPk(customer_id);
      new_customer = deletePassword(new_customer)
      return Response.success(res, {customer: new_customer}, responseMessages.UPDATE_SUCCESSFUL.message);
    }catch(error){
      log.error(`Update Failed {err: ${error}}`);
      return Response.failure(res, responseMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
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
    let {body, customer_id} = req
    try {
      await update_address(res, body);
      await Customer.update(body, {where: {customer_id}});
      let customer = await Customer.findByPk(customer_id);
      customer = deletePassword(customer);

      return Response.success(res, {customer}, responseMessages.UPDATE_SUCCESSFUL.message);
    }catch(error){
      log.error(`Update Customer Address Failed {err: ${error}}`);
      return Response.failure(res, responseMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
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
    let {body, customer_id} = req;

    try {
      await update_credit_card(res, body);
      await Customer.update(body, {where: {customer_id}});
      let customer = await Customer.findByPk(customer_id);
      customer = deletePassword(customer);
      return Response.success(res, {customer}, responseMessages.UPDATE_SUCCESSFUL.message);
    }catch(error){
      log.error(`Update Customer Credit Card Failed {err: ${error}}`);
      return Response.failure(res, responseMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

export default CustomerController;
