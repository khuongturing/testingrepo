/* eslint use-isnan: "error" */
/* eslint no-restricted-globals: ["error", "event", "fdescribe"] */
import errorResponse from '../helpers/errorResponse';

export default {
  validateQueryParams(req, res, next) {
    const {
      description_length: descriptionLength, limit, page, query_string: queryString
    } = req.query;
    const errors = [];
    req.cacheKeyPrefix = '';
    if (descriptionLength) {
      req.cacheKeyPrefix = `${req.cacheKeyPrefix}-d${descriptionLength}`;
      if (isNaN(descriptionLength)) errors.push('Description length must be a number');
    }
    if (limit) {
      req.cacheKeyPrefix = `${req.cacheKeyPrefix}-l${limit}`;
      if (isNaN(limit)) errors.push('Limit must be a number');
    }
    if (page) {
      req.cacheKeyPrefix = `${req.cacheKeyPrefix}-p${page}`;
      if (isNaN(page)) errors.push('Page must be a number');
    }
    if (queryString) {
      req.cacheKeyPrefix = `${req.cacheKeyPrefix}-q${queryString}`;
    }
    if (errors.length) {
      return res.status(400).json(errorResponse(req, res, 400, 'PRD_04', errors, ''));
    }
    next();
  }
};
