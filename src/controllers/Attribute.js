import models from '../../models/';
import { errorResponse } from '../utils/errors'

const { Attribute, AttributeValue, Product } = models;

/**
 * @description: A class containing all the Attribute controllers
 * 
 * @class: AttributeController
 * 
 */
class AttributeController{

    /**
     * @description: This method gets all existing attributes
     * 
     * @method: getAllAttributes
     * 
     * @param {object} req: request parameter
     * @param {object} res: response object
     * @param {object} next: error response
     * 
     * @return {object} response containing the attributes
     */
    static getAllAttributes = async(req, res, next) => {
        try {
            const attributes = await Attribute.findAll()
            return res.json(attributes)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets a single existing attribute
    *
    * @method: getSingleAttribute
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing an attribute
    */
    static getSingleAttribute = async(req, res, next) => {
        try {
            const { attribute_id } = req.params
            const attribute = await Attribute.findByPk(attribute_id)
            if (!attribute) {
                return res.status(404).send(
                    errorResponse("ATR_01", 404, 
                    "Don't exist attribute with this ID.", 
                    "attribute_id")
                )
            }
            res.json(attribute)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets value of an attribute
    *
    * @method: attributeValue
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing value of an attribute
    */
    static attributeValue = async(req, res, next) => {
        try {
            const { attribute_id } = req.params
            const attribute = await Attribute.findByPk(attribute_id)
            if (!attribute) {
                return res.status(404).send(
                    errorResponse("ATR_01", 404,
                        "Don't exist attribute with this ID.",
                        "attribute_id")
                )
            }
            const attributeValue = await AttributeValue.findAll({
                where: { attribute_id: attribute.attribute_id },
                attributes: ['attribute_value_id', 'value']
            })
            res.json(attributeValue)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets value of a product
    *
    * @method: productAttribute
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing the values of a product
    */
    static productAttribute = async(req, res, next) => {
        const productAttributeList = []
        try {
            const { product_id } = req.params
            const product = await Product.findByPk(product_id)
            if (!product) {
                return res.status(404).send(
                    errorResponse("PRO_01", 404,
                        "Don't exist product with this ID..",
                        "product_id")
                )
            }
            const productAttribute = await Product.findOne({
                where: { product_id: product_id },
                include: [{
                    model: AttributeValue,
                    include: [{ model: Attribute }]
                }]
            })
            productAttribute.AttributeValues.forEach((attribute) => {
                const { Attribute, attribute_value_id, value } = attribute
                const obj = {
                    attribute_name: Attribute.name,
                    attribute_value_id,
                    attribute_value: value
                }
                productAttributeList.push(obj)
            })
            res.json(productAttributeList)
        } catch (err) {
            next()
        }
    }
}

export default AttributeController;
