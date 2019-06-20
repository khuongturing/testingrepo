import { getQueryOptions } from 'src/utils/queryOptions';
import httpException from 'src/http/httpException';
import response from 'src/http/response';
import {
  ERROR_CODES,
} from 'src/config/constants';
import taxRepository from './repository';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getAllTaxes = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const result = await taxRepository.getAllTaxes(queryOptions);
  return response.success(res, result.rows);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getTaxById = async (req, res) => {
  const { taxId } = req.params;
  const queryOptions = getQueryOptions(req);
  queryOptions.taxId = taxId;

  const result = await taxRepository.getTaxById(queryOptions);
  if (!result) {
    throw httpException.handle(ERROR_CODES.TAX_01);
  }
  return response.success(res, result);
};
