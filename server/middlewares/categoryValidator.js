/* eslint use-isnan: "error" */
/* eslint no-restricted-globals: ["error", "event", "fdescribe"] */
import errorResponse from '../helpers/errorResponse';

export default {
  validateQueryParams(req, res, next) {
    const {
      limit, page, order
    } = req.query;
    const errors = [];
    req.cacheKeyPrefix = '';
    if (limit) {
      req.cacheKeyPrefix = `${req.cacheKeyPrefix}-l${limit}`;
      if (isNaN(limit)) errors.push('Limit must be a number');
    }
    if (page) {
      req.cacheKeyPrefix = `${req.cacheKeyPrefix}-p${page}`;
      if (isNaN(page)) errors.push('Page must be a number');
    }
    if (order) {
      req.cacheKeyPrefix = `${req.cacheKeyPrefix}-o${order}`;
      if (order !== 'name' && order !== 'category_id') {
        errors.push('Order must be category_id or name');
      }
    }
    if (errors.length) {
      return res.status(400).json(errorResponse(req, res, 400, 'CAT_04', errors, ''));
    }
    next();
  }
};
