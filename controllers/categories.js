import db from "../models/db";
import error from "../helpers/error";
/**
 *
 *
 * @class Categories
 */
class Categories {
  /**
   *
   *@static
   *@description Gets all categories
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns the response object
   * @memberof Categories
   */
  static getAllCategories(req, res) {
    db.query(`CALL 	catalog_get_categories()`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      res.status(200).json({ result: result[0] });
    });
  }
  /**
   *
   *@static
   *@description Get category by Id
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns the response object
   * @memberof Categories
   */
  static getCategoryById(req, res) {
    const id = Number(req.params.category_id);
    db.query(`CALL catalog_get_category_details(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("CAT_01", "category"));
      }
      res.status(200).json({ result: result[0][0] });
    });
  }
  /**
   *
   *@static
   *@description Get category by products
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns the response object
   * @memberof Categories
   */
  static getCategoryByProduct(req, res) {
    const id = Number(req.params.product_id);
    db.query(
      `CALL catalog_get_categories_for_product(${id})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        if (result[0].length === 0) {
          return res.status(404).json(error.emptyRow("CAT_02", "category"));
        }
        res.status(200).json({ result: result[0] });
      }
    );
  }
  /**
   *
   *@static
   *@description Get category by department
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns the response object
   * @memberof Categories
   */
  static getCategoryByDepartment(req, res) {
    const id = Number(req.params.department_id);
    db.query(`CALL catalog_get_categories_list(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("CAT_02", "category"));
      }
      res.status(200).json({ result: result[0] });
    });
  }
}

export default Categories;
