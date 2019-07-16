import db from "../models/db";
import error from "../helpers/error";
/**
 *
 *
 * @class Tax
 */
class Tax {
  /**
   *
   *@static
   *@description get all taxes
   * @param {*} req for requset object
   * @param {*} res for response object
   * @returns returns a result object
   * @memberof Tax
   */
  static getAllTaxes(req, res) {
    db.query("SELECT * FROM tax", (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      return res.status(200).json({ result });
    });
  }
  /**
   *
   * @static
   *@description get tax by Id
   * @param {*} req for requset object
   * @param {*} res for response object
   * @returns returns a result object
   * @memberof Tax
   */
  static getTaxById(req, res) {
    const { tax_id } = req.params;
    db.query(`SELECT * FROM tax WHERE tax_id=${tax_id}`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result.length === 0) {
        return res.status(404).json(error.emptyRow("TAX_02", "tax"));
      }
      return res.status(200).json({ result });
    });
  }
}

export default Tax;
