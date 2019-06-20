import joi from 'joi';
import httpException from 'src/http/httpException';
import registerCustomerSchema from './joiSchemas/registerCustomer';
import generateCustomerErrors from './joiSchemas/helpers/generateCustomerErrors';

/**
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - switch to the next route middleware
 * @return {*} - returns void or next()
 */
const validateRegisterCustomer = async (req, res, next) => {
  try {
    await joi.validate(req.body, registerCustomerSchema);
    next();
  } catch (error) {
    return next(generateCustomerErrors(error, httpException));
  }
};

export default validateRegisterCustomer;
