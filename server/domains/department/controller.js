import { getQueryOptions } from 'src/utils/queryOptions';
import response from 'src/http/response';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES,
} from 'src/config/constants';
import departmentRepository from './repository';
import departmentTransformer from './transformer';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getAllDepartments = async (req, res) => {
  const queryOptions = getQueryOptions(req);
  const result = await departmentRepository.getAllDepartments(queryOptions);
  return response.success(res, departmentTransformer.collection(result));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getSingleDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const result = await departmentRepository.getSingleDepartment({
    departmentId,
    requestURL: req.url
  });

  if (result === null || result === undefined) {
    throw httpException.handle(ERROR_CODES.DEP_01);
  }

  const responseData = departmentTransformer.item(result, req);
  return response.success(res, responseData);
};
