import { getQueryOptions } from 'src/utils/queryOptions';
import httpException from 'src/http/httpException';
import response from 'src/http/response';
import {
  ERROR_CODES,
} from 'src/config/constants';
import categoryRepository from './repository';
import categoryTransformer from './transformer';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getAllCategories = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const result = await categoryRepository.getAllCategories(queryOptions);

  const responseData = categoryTransformer.collection(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getProductCategories = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const { productId } = req.params;
  queryOptions.productId = productId;
  queryOptions.throwProductNotFound = () => { throw httpException.handle(ERROR_CODES.PRO_01); };
  const result = await categoryRepository.getProductCategories(queryOptions);

  const responseData = categoryTransformer.collection(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getDepartmentCategories = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const { departmentId } = req.params;
  queryOptions.departmentId = departmentId;
  queryOptions.throwDepartmentNotFound = () => { throw httpException.handle(ERROR_CODES.DEP_01); };
  const result = await categoryRepository.getDepartmentCategories(queryOptions);

  const responseData = categoryTransformer.collection(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getSingleCategory = async (req, res) => {
  const { categoryId } = req.params;
  const result = await categoryRepository.getSingleCategory({
    categoryId,
    requestURL: req.url
  });

  if (result === null || result === undefined) {
    throw httpException.handle(ERROR_CODES.CAT_01);
  }

  const responseData = categoryTransformer.item(result, req);
  return response.success(res, responseData);
};
