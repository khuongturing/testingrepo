import { getQueryOptions } from 'src/utils/queryOptions';
import httpException from 'src/http/httpException';
import response from 'src/http/response';
import productReviewTransformer from 'src/domains/review/transformer';
import {
  ERROR_CODES,
} from 'src/config/constants';
import productRepository from './repository';
import productTransformer from './transformer';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getAllProducts = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const result = await productRepository.getAllProducts(queryOptions);
  const responseData = productTransformer.collection(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getProductsForSearch = async (req, res) => {
  const { all_words = 'on', query_string } = req.query;
  const queryOptions = getQueryOptions(req);
  queryOptions.allWords = all_words;
  queryOptions.queryString = query_string;

  const result = await productRepository.getProductsForSearch(queryOptions);
  const responseData = productTransformer.collection(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getCategoryProducts = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const { categoryId } = req.params;
  queryOptions.categoryId = categoryId;
  queryOptions.throwCategoryNotFound = () => { throw httpException.handle(ERROR_CODES.CAT_01); };

  const result = await productRepository.getCategoryProducts(queryOptions);
  const responseData = productTransformer.collection(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getDepartmentProducts = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const { departmentId } = req.params;
  queryOptions.departmentId = departmentId;
  queryOptions.throwDepartmentNotFound = () => { throw httpException.handle(ERROR_CODES.DEP_01); };

  const result = await productRepository.getDepartmentProducts(queryOptions);
  const responseData = productTransformer.collection(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getSingleProduct = async (req, res) => {
  const { productId } = req.params;
  const result = await productRepository.getSingleProduct({
    productId,
    requestURL: req.url
  });
  if (result === null || result === undefined) {
    throw httpException.handle(ERROR_CODES.PRO_01);
  }
  const responseData = productTransformer.item(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getProductDetails = async (req, res) => {
  const { productId } = req.params;
  const result = await productRepository.getSingleProduct({
    productId,
    requestURL: req.url
  });
  if (result === null || result === undefined) {
    throw httpException.handle(ERROR_CODES.PRO_01);
  }
  const responseData = productTransformer.item(result, req);
  return response.success(res, responseData);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getProductLocations = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const { productId } = req.params;
  queryOptions.productId = productId;
  queryOptions.throwProductNotFound = () => { throw httpException.handle(ERROR_CODES.PRO_01); };
  let result = await productRepository.getProductLocations(queryOptions);
  result = productTransformer.locations.collection(result, req);
  return response.success(res, result.rows);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getProductReviews = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const { productId } = req.params;
  queryOptions.productId = productId;
  queryOptions.throwProductNotFound = () => { throw httpException.handle(ERROR_CODES.PRO_01); };

  const result = await productRepository.getProductReviews(queryOptions);
  return response.success(res, result.rows);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const createProductReview = async (req, res) => {
  const { productId } = req.params;
  const { id: customer_id } = req.decoded;
  const data = req.body;
  data.customer_id = customer_id;
  const throwProductNotFound = () => { throw httpException.handle(ERROR_CODES.PRO_01); };

  const result = await productRepository.createProductReview({
    data,
    throwProductNotFound,
    productId,
  });
  return response.success(res, await productReviewTransformer.item(result));
};
