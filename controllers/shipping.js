import db from "../models/db";
import error from "../helpers/error";
/**
 *
 *
 * @class ShippingRegions
 */
class ShippingRegions {
  /**
   *
   * @static
   * @description get all shipping regions
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShippingRegions
   */
  static getShippingregions(req, res) {
    db.query(`CALL customer_get_shipping_regions()`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      return res.status(200).json({ result: result[0] });
    });
  }
  /**
   *
   * @static
   * @description get shipping regions by Id
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShippingRegions
   */
  static getShippingRegionsById(req, res) {
    const { shipping_region_id } = req.params;
    db.query(
      `CALL orders_get_shipping_info(${shipping_region_id})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        if (result[0].length === 0) {
          return res
            .status(404)
            .json(error.emptyRow("SHR_01", "shipping region"));
        }
        return res.status(200).json({ result: result[0] });
      }
    );
  }
}

export default ShippingRegions;
