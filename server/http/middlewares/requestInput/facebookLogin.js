import joi from 'joi';
import httpException from 'src/http/httpException';
import facebookLoginSchema from './joiSchemas/facebookLogin';
import generateCustomerErrors from './joiSchemas/helpers/generateCustomerErrors';

/**
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - switch to the next route middleware
 * @return {*} - returns void or next()
 */
const validateFacebookLogin = async (req, res, next) => {
  try {
    await joi.validate(req.body, facebookLoginSchema);
    next();
  } catch (error) {
    return next(generateCustomerErrors(error, httpException));
  }
};

export default validateFacebookLogin;
