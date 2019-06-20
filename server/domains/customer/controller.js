import response from 'src/http/response';
import { Customer as CustomerModel } from 'src/domains/models';
import httpException from 'src/http/httpException';
import { generateToken } from 'src/utils/tokenHandler';
import { ERROR_CODES } from 'src/config/constants';
import facebookLoginService from 'src/services/facebookLogin';
import customerRepository from './repository';
import customerTransformer from './transformer';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const registerCustomer = async (req, res) => {
  const input = req.body;
  const customer = await CustomerModel.getByField('email', input.email);
  if (customer) {
    throw httpException.handle(ERROR_CODES.USR_04);
  }
  const newCustomer = await customerRepository.createCustomer(input);

  const { token, expiresIn } = generateToken(newCustomer);
  const data = {
    customer: {
      schema: customerTransformer.item(newCustomer),
    },
    accessToken: token,
    expires_in: expiresIn,
  };
  return response.success(res, data);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  const customer = await CustomerModel.getByField('email', email);
  if (!customer) {
    throw httpException.handle(ERROR_CODES.USR_05);
  }

  const isCorrectPassword = await CustomerModel.hasCorrectPassword(password, customer);
  if (!isCorrectPassword) {
    throw httpException.handle(ERROR_CODES.USR_01);
  }

  const { token, expiresIn } = generateToken(customer);
  const data = {
    customer: {
      schema: customerTransformer.item(customer),
    },
    accessToken: token,
    expires_in: expiresIn,
  };
  return response.success(res, data);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const loginWithFacebook = async (req, res) => {
  const { access_token } = req.body;
  const facebookUser = await facebookLoginService.login(access_token);
  const customer = await CustomerModel.storeFacebookUser(facebookUser);

  const { token, expiresIn } = generateToken(customer);
  const data = {
    customer: {
      schema: customerTransformer.item(customer),
    },
    accessToken: token,
    expires_in: expiresIn,
  };
  return response.success(res, data);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getCustomerById = async (req, res) => {
  const { id: customerId } = req.decoded;
  const customer = await customerRepository.getCustomerById(customerId);
  return response.success(res, customerTransformer.item(customer));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const updateCustomer = async (req, res) => {
  const { id: customerId } = req.decoded;
  const data = req.body;
  const customer = await CustomerModel.updateCustomer({ customerId, data });
  return response.success(res, customerTransformer.item(customer));
};
