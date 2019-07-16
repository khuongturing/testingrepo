import uuid from "uuid";
import db from "../models/db";
import error from "../helpers/error";
/**
 *
 *
 * @class ShoppingCart
 */
class ShoppingCart {
  /**
   *
   * @static
   * @description generate a unique id
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns the cart id
   * @memberof ShoppingCart
   */
  static generateCartId(req, res) {
    const cartId = uuid();
    res.status(200).json({ cartId });
  }

   /**
   *
   * @static
   * @description add new shopping cart
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static addShoppingCart(req, res) {
    const { cart_id, product_id, attributes } = req.body;

    db.query(
      `CALL shopping_cart_add_product('${cart_id}', '${product_id}', '${attributes}')`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        return res.status(201).json({ result: result });
      }
    );
  }
  /**
   *
   * @static
   * @description get shopping cart by Id
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static getShoppingCartById(req, res) {
    const { cart_id } = req.params;

    db.query(
      `SELECT * FROM shopping_cart WHERE item_id=${cart_id}`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        if (!result.length) {
          return res
            .status(404)
            .json(error.emptyRow("SHC_02", "shopping cart"));
        }
        return res.status(200).json({ result: result[0] });
      }
    );
  }
   /**
   *
   * @static
   * @description update a shopping cart
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static updateShoppingCart(req, res) {
    const { item_id } = req.params;
    const { quantity } = req.body;
    db.query(
      `CALL shopping_cart_update(${item_id}, ${quantity})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        return res.status(200).json({ result: result });
      }
    );
  }
  /**
   *
   * @static
   * @description delete a shopping cart
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static deleteShoppingCart(req, res) {
    const cart_id = Number(req.params.cart_id);
    db.query(`CALL shopping_cart_remove_product(${cart_id})`, (err, result) => {
      if (err) return res.json(error.databaseError());
      return res.status(200).json({ result: result });
    });
  }
  /**
   *
   * @static
   * @description move a product to a shopping cart
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static moveProductToShoppingCart(req, res) {
    const item_id = Number(req.params.item_id);
    db.query(
      `CALL shopping_cart_move_product_to_cart(${item_id})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        return res.status(200).json({ result: result });
      }
    );
  }

  /**
   *
   * @static
   * @description get the total amount of a shopping cart
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static getTotalAmountOfShoppingCart(req, res) {
    const { cart_id } = req.params;
    db.query(
      `CALL shopping_cart_get_total_amount(${cart_id})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        return res.status(200).json({ result: result[0][0] });
      }
    );
  }
   /**
   *
   * @static
   * @description save a shopping cart for later
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static saveCartForLater(req, res) {
    const { item_id } = req.params;
    db.query(
      `CALL shopping_cart_save_product_for_later(${item_id})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());

        return res.status(200).json({ result: result });
      }
    );
  }
  /**
   *
   * @static
   * @description ger saved shopping cart
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static getSavedProducts(req, res) {
    const { cart_id } = req.params;
    db.query(
      `CALL shopping_cart_get_saved_products(${cart_id})`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        return res.status(200).json({ result: result[0][0] });
      }
    );
  }
   /**
   *
   * @static
   * @description remove a shopping cart
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof ShoppingCart
   */
  static removeCart(req, res) {
    const { item_id } = req.params;
    db.query(`CALL shopping_cart_empty(${item_id})`, (err, result) => {
      if (err) return res.json(error.databaseError());
      return res.status(200).json({ result: result });
    });
  }
}

export default ShoppingCart;
