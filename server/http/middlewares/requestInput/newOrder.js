import joi from 'joi';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES,
} from 'src/config/constants';
import newOrder from './joiSchemas/newOrder';

/**
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - handle to the next middleware
 * @return {void}
 */
const validateNewOrder = async (req, res, next) => {
  try {
    await joi.validate(req.body, newOrder);
    next();
  } catch (error) {
    const errorDetail = error.details[0];
    const message = errorDetail.message.replace(/"/g, '');
    next(httpException.handle(ERROR_CODES.ORD_01, message));
  }
};

export default validateNewOrder;
