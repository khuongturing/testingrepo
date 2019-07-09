/**
 * The Shipping Controller contains all the static methods that handles all shipping request
 * This piece of code work fine, but you can test and debug any detected issue
 * 
 * - getShippingRegions - Returns a list of all shipping region
 * - getShippingType - Returns a list of shipping type in a specific shipping region
 * 
 */
import { ShippingRegion, Shipping, Sequelize } from '../database/models';
let log = require('fancy-log');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus');
let Response = require('../lib/responseManager');
const { Op } = Sequelize;

class ShippingController {
  /**
   * get all shipping regions
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and shipping regions data
   * @memberof ShippingController
   */
  static async getShippingRegions(req, res, next) {
    try {
      const shipping_regions = await ShippingRegion.findAll();
      return Response.success(res, {shipping_regions})
    } catch (error) {
      log.error(`Error Getting Single Tax ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }

  /**
   * get get shipping region shipping types
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and shipping types data
   * @memberof ShippingController
   */
  static async getShippingType(req, res, next) {
    const { shipping_region_id } = req.params;
    if(!shipping_region_id || typeof parseInt(shipping_region_id) !== "number")
    return Response.failure(res, responseMessages.SHIPPING_REGION_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'shipping_region_id');
    try {
      const shipping_types = await Shipping.findAll({
        where: {
          shipping_region_id,
        },
      });
      return Response.success(res, {shipping_types})
    } catch (error) {
      log.error(`Error Getting Single Tax ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)    }
  }
}

export default ShippingController;
