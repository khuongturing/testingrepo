import joi from 'joi';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES,
} from 'src/config/constants';
import newReviewSchema from './joiSchemas/newReview';

/**
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - switch to the next route middleware
 * @return {*} - returns void or next()
 */
const validateNewReview = async (req, res, next) => {
  try {
    await joi.validate(req.body, newReviewSchema);
    next();
  } catch (error) {
    const errorDetail = error.details[0];
    const message = errorDetail.message.replace(/"/g, '');
    return next(httpException.handle(ERROR_CODES.REV_01, message));
  }
};

export default validateNewReview;
