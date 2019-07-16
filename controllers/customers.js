import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { hashPassword, comparePassword } from "../helpers/passwordEncrypt";
import db from "../models/db";
import error from "../helpers/error";

dotenv.config();
/**
 *
 *
 * @class Customers
 */
class Customers {
  /**
   *
   * @static
   * @description create a new customer
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Customers
   */
  static createCustomer(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    db.query(
      `CALL customer_add('${name}', '${email}', '${hashedPassword}')`,
      (err, result) => {
        if (err)
        {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json(error.emailExistsError());
          }
          return res.status(400).json(error.databaseError());
        }
        jwt.sign(
          { name, email },
          process.env.SECRET_KEY,
          { expiresIn: "24h" },
          (err, token) => {
            return res.status(201).json({
              customer: result,
              accessToken: token,
              expires_in: "24h"
            });
          }
        );
      }
    );
  }
  /**
   *
   * @static
   * @description logs in existing users
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Customers
   */
  static loginUser(req, res) {
    const { email, password } = req.body;
    db.query(`SELECT * FROM customer WHERE email='${email}'`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result.length === 0) {
        return res.status(404).json({
          code: "USR_01",
          message: "Incorrect email or password",
          status: "404"
        });
      }
      if (comparePassword(password, `${result[0].password}`)) {
        const name = result[0].name;
        jwt.sign(
          { name, email },
          process.env.SECRET_KEY,
          { expiresIn: "24h" },
          (err, token) => {
            return res.status(201).json({
              customer: result[0],
              accessToken: token,
              expires_in: "24h"
            });
          }
        );
      } else {
        return res.status(404).json({
          code: "USR_01",
          message: "Incorrect email or password",
          status: "404"
        });
      }
    });
  }
  /**
   *
   * @static
   * @description gets a customer by email
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Customers
   */
  static getCustomer(req, res) {
    const { email } = req;
    db.query(`SELECT * FROM customer WHERE email='${email}'`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result.length === 0) {
        return res.status(404).json({
          code: "USR_01",
          message: "There is no customer associated with this email",
          status: "400"
        });
      }
      return res.status(200).json({ result });
    });
  }
  /**
   *
   * @static
   * @description updates a customer's address
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Customers
   */
  static updateAddress(req, res) {
    const { email } = req;
    const {
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country
    } = req.body;
    db.query(`SELECT * FROM customer WHERE email='${email}'`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      const { customer_id, shipping_region_id } = result[0];
      db.query(
        `CALL customer_update_address('${customer_id}', '${address_1}', '${address_2}', '${city}', '${region}', '${postal_code}', '${country}', '${shipping_region_id}')`,
        (err, updateResult) => {
          if (err) return res.status(400).json(error.databaseError());
          return res.status(200).json({ result: updateResult });
        }
      );
    });
  }
  /**
   *
   * @static
   * @description updates a customer's credit card
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns returns a response object
   * @memberof Customers
   */
  static updateCreditcard(req, res) {
    const { email } = req;
    const { credit_card } = req.body;
    db.query(`SELECT * FROM customer WHERE email='${email}'`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      const { customer_id } = result[0];
      db.query(
        `CALL customer_update_credit_card('${customer_id}', '${credit_card}')`,
        (err, updateResult) => {
          return res.status(200).json({ result: updateResult });
        }
      );
    });
  }
}

export default Customers;
