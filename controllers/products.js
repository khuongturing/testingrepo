import db from "../models/db";
import error from "../helpers/error";
/**
 *
 *
 * @class Products
 */
class Products {
  /**
   *
   * @static
   * @description get all products
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Products
   */
  static getAllProducts(req, res) {
    db.query(`SELECT * FROM product`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      res.status(200).json({
        count: result.length,
        rows: result
      });
    });
  }

  /**
   *
   * @static
   * @description get product by id
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Products
   */
  static getProductById(req, res) {
    const id = Number(req.params.product_id);
    db.query(`CALL catalog_get_product_details(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("PRO_01", "product"));
      }
      res.status(200).json({ result: result[0][0] });
    });
  }

  /**
   *
   * @static
   * @description get all products by category
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Products
   */
  static getProductsByCategory(req, res) {
    const id = Number(req.params.category_id);
    const { page, limit, description_length } = req.query;
    db.query(
      `CALL catalog_get_products_in_category(${id}, ${description_length}, ${page}, ${limit})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        if (result[0].length === 0) {
          return res.status(404).json(error.emptyRow("PRO_02", "product"));
        }
        res.status(200).json({
          count: result.length,
          rows: result
        });
      }
    );
  }

  /**
   *
   * @static
   * @description get all products by location
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Products
   */
  static getAllProductsByLocation(req, res) {
    const id = Number(req.params.product_id);
    console.log(id);
    db.query(`CALL catalog_get_product_locations(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("PRO_02", "product"));
      }
      res.status(200).json({ result: result[0] });
    });
  }

  /**
   *
   * @static
   * @description get all products by reviews
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Products
   */
  static getAllProductsByReview(req, res) {
    const id = Number(req.params.product_id);
    db.query(`CALL catalog_get_product_reviews(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("PRO_02", "product"));
      }
      res.status(200).json({ result: result[0] });
    });
  }

  /**
   *
   * @static
   * @description search products by query strings
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Products
   */
  static searchProducts(req, res) {
    const { query_string, all_words } = req.query;
    const description_length = Number(req.query.description_length);
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);

    db.query(
      `CALL catalog_search('${query_string}', '${all_words}', ${description_length}, ${limit}, ${page})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        if (result[0].length === 0) {
          return res.status(404).json(error.emptyRow("PRO_02", "product"));
        }
        res.status(200).json({ result: result[0] });
      }
    );
  }
}

export default Products;
