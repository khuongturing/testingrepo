
/**
 * Tax controller contains methods which are needed for all tax request
 * Implement the functionality for the methods
 * 
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import {
  Tax,
  Sequelize,
} from '../database/models';
let log = require('fancy-log');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus');
let Response = require('../lib/responseManager');
const { Op } = Sequelize;
class TaxController {
  /**
   * This method get all taxes
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllTax(req, res, next) {

    try{
      let all_tax = await Tax.findAll();
      return Response.success(res, {all_tax});
    }catch(error){
      log.error(`Error Getting Single Tax ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * This method gets a single tax using the tax id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleTax(req, res, next) {
    let {tax_id} = req.params;
    if(!tax_id || typeof parseInt(tax_id) !== "number")
    return Response.failure(res, responseMessages.TAX_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'tax_id');

    try{
      let tax = await Tax.findByPk(tax_id);
      return Response.success(res, {tax});
    }catch(error){
      log.error(`Error Getting Single Tax ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

export default TaxController;
