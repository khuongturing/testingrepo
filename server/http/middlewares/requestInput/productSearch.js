import joi from 'joi';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES,
} from 'src/config/constants';
import produtSearchSchema from './joiSchemas/productSearch';

/**
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - switch to the next route middleware
 * @return {*} - returns void or next()
 */
const validateProductSearch = async (req, res, next) => {
  try {
    const queryObject = {
      query_string: req.query.query_string
    };
    await joi.validate(queryObject, produtSearchSchema);
    next();
  } catch (error) {
    return next(httpException.handle(ERROR_CODES.PRO_02));
  }
};

export default validateProductSearch;
