import { getOrderByData } from 'src/utils/pagination';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES,
  FIELDS_ALLOWED_ORDER,
  ORDER_VALUES_ALLOWED
} from 'src/config/constants';

/**
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - switch to the next route middleware
 * @return {*} - returns void or next()
 */
export const validatePage = (req, res, next) => {
  if (req.query.page < 1) {
    return next(httpException.handle(ERROR_CODES.PAG_03));
  }
  next();
};

export const validateOrderBy = requestedModelName => (req, res, next) => {
  const { orderBy = '' } = req.query;
  const { orderField, orderValue } = getOrderByData(orderBy);

  if (orderBy) {
    const fieldAllowed = FIELDS_ALLOWED_ORDER[requestedModelName].includes(orderField);
    const orderValueAllowed = ORDER_VALUES_ALLOWED.includes(orderValue);

    if (!fieldAllowed) {
      return next(httpException.handle(ERROR_CODES.PAG_02));
    }
    if (!orderValueAllowed) {
      const message = `The order is not matched '${orderField},${orderValue}`;
      return next(httpException.handle(ERROR_CODES.PAG_01, message));
    }
  }
  next();
};
