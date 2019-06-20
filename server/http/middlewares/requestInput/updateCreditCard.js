import joi from 'joi';
import httpException from 'src/http/httpException';
import updateCreditCardSchema from './joiSchemas/updateCreditCard';
import generateCustomerErrors from './joiSchemas/helpers/generateCustomerErrors';

/**
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - switch to the next route middleware
 * @return {*} - returns void or next()
 */
const validateUpdateCustomer = async (req, res, next) => {
  try {
    await joi.validate(req.body, updateCreditCardSchema);
    next();
  } catch (error) {
    next(generateCustomerErrors(error, httpException));
  }
};

export default validateUpdateCustomer;
