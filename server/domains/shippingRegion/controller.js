import { getQueryOptions } from 'src/utils/queryOptions';
import httpException from 'src/http/httpException';
import response from 'src/http/response';
import {
  ERROR_CODES,
} from 'src/config/constants';
import shippingRegionRepository from './repository';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getShippingRegions = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const result = await shippingRegionRepository.getAllShippingRegions(queryOptions);
  return response.success(res, result.rows);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getShippingsForARegion = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  queryOptions.shippingRegionId = req.params.shippingRegionId;
  queryOptions.throwRegionNotFound = () => { throw httpException.handle(ERROR_CODES.RGN_01); };

  const result = await shippingRegionRepository.getShippingsForARegion(queryOptions);
  return response.success(res, result.rows);
};
