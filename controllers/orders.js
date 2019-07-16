import db from "../models/db";
import error from "../helpers/error";
/**
 *
 *
 * @class Orders
 */
class Orders {
  /**
   *
   * @static
   * @description create new orders
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a respponse object
   * @memberof Orders
   */
  static createOrders(req, res) {
    const { email } = req;
    const { cart_id, shipping_id, tax_id } = req.body;
    db.query(`SELECT * FROM customer WHERE email='${email}'`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      const { customer_id } = result[0];
      db.query(
        `CALL shopping_cart_create_order('${cart_id}', '${customer_id}', '${shipping_id}', '${tax_id}')`,
        (err, result) => {
          return res.status(201).json({ result: result[0][0] });
        }
      );
    });
  }

  /**
   *
   * @static
   * @description get order by id
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a respponse object
   * @memberof Orders
   */
  static getOrderById(req, res) {
    const order_id = req.params.order_id;
    console.log(order_id);
    db.query(
      `SELECT * FROM orders WHERE order_id=${order_id}`,
      (err, result) => {
        if (err) return res.status(400).json(error.databaseError());
        if (result.length === 0) {
          return res.status(404).json(error.emptyRow("ORD_02", "order"));
        }
        return res.status(200).json({ result: result[0] });
      }
    );
  }

  /**
   *
   * @static
   * @description get orders by customer
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a respponse object
   * @memberof Orders
   */
  static getOrdersByCustomer(req, res) {
    const { email } = req;
    db.query(`SELECT * FROM customer WHERE email='${email}'`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      const { customer_id } = result[0];
      db.query(
        `CALL orders_get_by_customer_id('${customer_id}')`,
        (err, result) => {
          if (err) return res.status(400).json(error.databaseError());
          return res.status(200).json({ result: result[0] });
        }
      );
    });
  }

  /**
   *
   * @static
   * @description get order's short details
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a respponse object
   * @memberof Orders
   */
  static shortDetailOrder(req, res) {
    const { order_id } = req.params;
    console.log(order_id);
    db.query(
      `CALL orders_get_order_short_details('${order_id}')`,
      (err, result) => {
        console.log(result);
        if (err) return res.status(400).json(error.databaseError());
        return res.status(200).json({ result: result[0][0] });
      }
    );
  }
}
export default Orders;
