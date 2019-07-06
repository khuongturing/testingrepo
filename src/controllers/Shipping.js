import models from '../../models/';
import { errorResponse } from '../utils/errors';

const { ShippingRegion, Shipping } = models;

/**
 * @description: A class containing all the Shipping controllers
 *
 * @class: ShippingController
 *
 */
class ShippingController{
    /**
    * @description: This method gets all shipping regions
    *
    * @method: shippingRegions
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing the regions
    */
    static shippingRegions = async(req, res, next) =>{
        try {
            const regions = await ShippingRegion.findAll()
            return res.json(regions)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets a particular region
    *
    * @method: shippingRegion
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing the region
    */
    static shippingRegion = async(req, res, next) => {
        try {
            const { shipping_region_id } = req.params
            const isValidRegion = await ShippingRegion.findByPk(shipping_region_id);
            if(!isValidRegion){
                return res.status(404).send(
                    errorResponse("SHI_01", 404,
                        "Don't exist shipping with this ID.",
                        "shipping region Id")
                )
            }
            const regionId = isValidRegion.shipping_region_id
            const region = await Shipping.findAll({
                where: { shipping_region_id: regionId }
            })
            return res.json(region)
        } catch (err) {
            next()
        }
    }
}

export default ShippingController;
