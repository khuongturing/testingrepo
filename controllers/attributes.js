import db from "../models/db";
import error from "../helpers/error";
/**
 *
 *
 * @class Attributes
 */

class Attributes {
  /**
   *
   *@static
   *@description Gets all the attributes
   * @param {*} req for request object
   * @param {*} res for response object
   * @return a response object
   * @memberof Attributes
   */
  static getAllAttributes(req, res) {
    db.query(`CALL 	catalog_get_attributes()`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      return res.status(200).json({ result: result[0] });
    });
  }
  /**
   *
   *@static
   *@description Gets attribute by Id
   * @param {*} req for request object
   * @param {*} res for response object
   * @return a response object
   * @memberof Attributes
   */
  static getAttributeById(req, res) {
    const id = Number(req.params.attribute_id);
    db.query(`CALL catalog_get_attribute_details(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("ATT_01", "attribute"));
      }
      res.status(200).json({ result: result[0][0] });
    });
  }

  /**
   *
   *@static
   *@description Gets all the attributes by values
   * @param {*} req for request object
   * @param {*} res for response object
   * @return a response object
   * @memberof Attributes
   */
  static getAttributeByValues(req, res) {
    const id = Number(req.params.attribute_id);
    db.query(`CALL catalog_get_attribute_values(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("ATT_02", "attribute"));
      }
      res.status(200).json({ result: result[0] });
    });
  }
  /**
   *
   *@static
   *@description Gets all the attributes by products
   * @param {*} req for request object
   * @param {*} res for response object
   * @return a response object
   * @memberof Attributes
   */
  static getAllAttributesByProduct(req, res) {
    const id = Number(req.params.product_id);
    console.log(id);
    db.query(
      `CALL catalog_get_attributes_not_assigned_to_product(${id})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        if (result[0].length === 0) {
          return res.status(404).json(error.emptyRow("ATT_02", "attribute"));
        }
        res.status(200).json({ result: result[0] });
      }
    );
  }
}

export default Attributes;
