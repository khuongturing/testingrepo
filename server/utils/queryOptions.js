import { getPaginationMeta } from 'src/utils/pagination';

/**
 * This extract properties in the request object that are then used
 * for preparing the query passed to the Sequelize models and applied to the query.
 * It contains requestURL, used as key for find or store values in the redis cache
 *
 * @param {Object} req - request
 * @returns {Object} -  options passed to repositories or models for mapping queries
 */
export const getQueryOptions = (req) => {
  const paginationMeta = getPaginationMeta(req);

  return {
    requestURL: req.url,
    paginationMeta
  };
};
