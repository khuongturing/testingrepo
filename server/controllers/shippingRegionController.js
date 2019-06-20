import 'dotenv/config';
import Model from '../database/models';
import errorResponse from '../helpers/errorResponse';

const {
  Shipping, ShippingRegion
} = Model;

/**
 *
 *
 * @export
 * @class ShippingRegionController
 * @description Operations on shipping regions
 */
export default class ShippingRegionController {
  /**
    * @description -This method gets all shiping regions
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {array} - shiiping regions
    */
  static async allShippingRegions(req, res) {
    try {
      const shippingRegions = await ShippingRegion.findAll();
      res.status(200).json(shippingRegions);
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'SHR_500', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method gets all shiping regions
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {array} - shiiping regions
    */
  static async getShippingForShippingRegion(req, res) {
    try {
      const { shipping_region_id: shippingRegionId } = req.params;
      // eslint-disable-next-line
      if (isNaN(shippingRegionId)) {
        return res.status(400).json({
          error: {
            status: 400,
            message: 'Shipping Region id must be a number',
            field: 'shipping region id'
          }
        });
      }
      const shippingRegion = await ShippingRegion.findOne({
        where: { shipping_region_id: shippingRegionId },
        include: [{
          model: Shipping,
          attributes: [
            'shipping_id',
            'shipping_type',
            'shipping_cost',
            'shipping_region_id'
          ]
        }]
      });
      if (!shippingRegion) {
        return res.status(404).json({
          error: {
            status: 404,
            message: 'Shipping Region id does not exist',
          }
        });
      }
      res.status(200).json(shippingRegion.Shippings);
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'SHR_500', error.parent.sqlMessage, ''));
    }
  }
}
