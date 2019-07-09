/**
 * The controller defined below is the attribute controller, highlighted below are the functions of each static method
 * in the controller
 *  Some methods needs to be implemented from scratch while others may contain one or two bugs
 * 
 * - getAllAttributes - This method should return an array of all attributes
 * - getSingleAttribute - This method should return a single attribute using the attribute_id in the request parameter
 * - getAttributeValues - This method should return an array of all attribute values of a single attribute using the attribute id
 * - getProductAttributes - This method should return an array of all the product attributes
 * NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import {Attribute, AttributeValue, ProductAttribute} from '../database/models';
let log = require('fancy-log')
let UtilityHelper = require('../lib/utilityHelper');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus');
let Response = require('../lib/responseManager')
class AttributeController {
  /**
   * This method get all attributes
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllAttributes(req, res, next) {
    try{
      let {rows, count} = await Attribute.findAndCountAll();
      return Response.success(res, {attributes: rows, count});
    }catch(error){
      log.error(`Error Getting Attributes {err: ${error}}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * This method gets a single attribute using the attribute id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleAttribute(req, res, next) {
    let {attribute_id} = req.params;
      if(!attribute_id || typeof parseInt(attribute_id) !== "number")
                return Response.failure(res, responseMessages.ATTRIBUTE_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'attribute_id')

      try{
          let attribute = await Attribute.findByPk(attribute_id);
          if(!attribute) return Response.failure(res, responseMessages.ATTRIBUTE_NOT_EXISTS, HttpStatus.NOT_FOUND);
          
          return Response.success(res, {attribute})
      }catch(error){
          log.error(`Error Getting Attribute Details for attribute_id : ${attribute_id}, {error: ${error}}`);
          return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    
  }

  /**
   * This method gets a list attribute values in an attribute using the attribute id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAttributeValues(req, res, next) {
    let {attribute_id} = req.params;
      if(!attribute_id || typeof parseInt(attribute_id) !== "number")
                return Response.failure(res, responseMessages.ATTRIBUTE_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'attribute_id')

      try{
          let {rows, count} = await AttributeValue.findAndCountAll({where: {attribute_id}});
          
          return Response.success(res, {attribute_value: rows, count})
      }catch(error){
          log.error(`Error Getting Attribute Values for attribute_id : ${attribute_id}, {error: ${error}}`);
          return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  /**
   * This method gets a list attribute values in a product using the product id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getProductAttributes(req, res, next) {
    try{
      let {product_id} = req.params;
      if(!product_id || typeof parseInt(product_id) !== "number")
                return Response.failure(res, responseMessages.PRODUCT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'product_id');
      
      let {rows, count} = await ProductAttribute.findAndCountAll({
        where: {product_id},
        include: [{
          model : AttributeValue,
          include: [Attribute]
        }]
      })
      let product_attributes = rows.map(pdt_attr => {
        return {
          attribute_name: pdt_attr.AttributeValue.Attribute.name,
          attribute_value_id: pdt_attr.dataValues.attribute_value_id,
          attribute_value: pdt_attr.AttributeValue.value
        }
      })
      return Response.success(res, {count, product_attributes})
    }catch(error){
      log.error(`Error Getting Product Attribute for product_id : ${product_id}, {error: ${error}}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export default AttributeController;
