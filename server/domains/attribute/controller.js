import { getQueryOptions } from 'src/utils/queryOptions';
import httpException from 'src/http/httpException';
import productTransformer from 'src/domains/product/transformer';
import response from 'src/http/response';
import {
  ERROR_CODES,
} from 'src/config/constants';
import attributeRepository from './repository';
import attributeTransformer from './transformer';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getAllAttributes = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const result = await attributeRepository.getAllAttributes(queryOptions);
  return response.success(res, attributeTransformer.collection(result, req));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getValuesForAttribute = async (req, res) => {
  const { attributeId } = req.params;
  const queryOptions = getQueryOptions(req);
  queryOptions.throwAttributeNotFound = () => { throw httpException.handle(ERROR_CODES.ATR_01); };
  queryOptions.attributeId = attributeId;

  const result = await attributeRepository.getValuesForAttribute(queryOptions);
  return response.success(res, attributeTransformer.values.collection(result, req));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getProductAttributes = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const { productId } = req.params;
  queryOptions.productId = productId;
  queryOptions.throwProductNotFound = () => { throw httpException.handle(ERROR_CODES.PRO_01); };
  let result = await attributeRepository.getProductAttributes(queryOptions);

  result = productTransformer.attributeValues.collection(result, req);
  return response.success(res, result.rows);
};
