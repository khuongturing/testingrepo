/**
 * Check each method in the shopping cart controller and add code to implement
 * the functionality or fix any bug.
 * The static methods and their function include:
 * 
 * - generateUniqueCart - To generate a unique cart id
 * - addItemToCart - To add new product to the cart
 * - getCart - method to get list of items in a cart
 * - updateCartItem - Update the quantity of a product in the shopping cart
 * - emptyCart - should be able to clear shopping cart
 * - removeItemFromCart - should delete a product from the shopping cart
 * - createOrder - Create an order
 * - getCustomerOrders - get all orders of a customer
 * - getOrderSummary - get the details of an order
 * - processStripePayment - process stripe payment
 * 
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */

import { Customer, Product, ShoppingCart, Order, OrderDetail, Sequelize } from '../database/models';
import Auth from '../auth/auth';

/**
 *
 *
 * @class shoppingCartController
 */
class ShoppingCartController {
  /**
   * generate random unique id for cart identifier
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart_id
   * @memberof shoppingCartController
   */
  static generateUniqueCart(req, res) {
    // implement method to generate unique cart Id
    const uniqid = require("uniqid")
    return res.status(200).json({ cart_id: uniqid() });
  }

  /**
   * adds item to a cart with cart_id
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async addItemToCart(req, res, next) {
    // implement function to add item to cart
    try {
      const { cart_id, product_id, attributes, quantity } = req.body;
      var item_id;
      await ShoppingCart.create({ cart_id, product_id, attributes, quantity }).then(function (inserted) {
        item_id = inserted.dataValues.item_id;
      });
      const cart = await ShoppingCart.findByPk(item_id, {
        attributes: ['item_id', 'cart_id', 'attributes', 'product_id', 'quantity']
      });

      return res.status(200).json(cart);
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ message: 'this works' });
  }

  /**
   * get shopping cart using the cart_id
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async getCart(req, res, next) {
    // implement method to get cart items
    const { cart_id } = req.params;
    const cart = await ShoppingCart.findAll({
      where: { cart_id },
      attributes: [
        'item_id', 'cart_id',
        [Sequelize.col('product.name'), 'name'],
        'attributes','product_id',
        [Sequelize.col('product.image'), 'image'],
        [Sequelize.col('product.price'), 'price'],
        [Sequelize.col('product.discounted_price'), 'discounted_price'],
        'quantity',
        [Sequelize.literal('product.price * quantity'), 'subtotal']        
      ],
      include: [{ model: Product, attributes: [] }]
    });
    return res.status(200).json(cart);
  }

  /**
   * update cart item quantity using the item_id in the request param
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async updateCartItem(req, res, next) {
    const { item_id } = req.params // eslint-disable-line
    try {
      const { quantity } = req.body;
      await ShoppingCart.update({ quantity }, { where: { item_id } });
      const cart = await ShoppingCart.findByPk(item_id, {
        attributes: ['item_id', 'cart_id', 'attributes', 'product_id', 'quantity']
      });
      return res.status(200).json(cart);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * removes all items in a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async emptyCart(req, res, next) {
    // implement method to empty cart
    const { cart_id } = req.params // eslint-disable-line
    try {
      await ShoppingCart.destroy({ where: { cart_id } });
      const cart = await ShoppingCart.findAll({ where: { cart_id } });
      return res.status(200).json(cart);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * remove single item from cart
   * cart id is obtained from current session
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with message
   * @memberof ShoppingCartController
   */
  static async removeItemFromCart(req, res, next) {

    try {
      // implement code to remove item from cart here
      const { item_id } = req.params // eslint-disable-line
      await ShoppingCart.destroy({ where: { item_id } });
      return res.status(200).json({ message: 'Item has deleted successfully' });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * create an order from a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with created order
   * @memberof ShoppingCartController
   */
  static async createOrder(req, res, next) {

    // implement code for creating order here
    const { cart_id, shipping_id, tax_id } = req.body;
    try {
      // write code to get order
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { customer_id } = result.decoded;
          ShoppingCart.findAll({ where: { cart_id } }).then(function (cart) {
            if (cart.length > 0) {
              Order.create({ customer_id, shipping_id, tax_id }).then(function (inserted) {
                let order_id = inserted.dataValues.order_id;
                let total_amount = 0;
                cart.forEach(function (item) {
                  let { product_id, attributes, quantity } = item;
                  Product.findOne({ where: { product_id } }).then(function (product) {
                    let product_name = product.name;
                    let unit_cost = (product.discounted_price > 0 ? product.discounted_price : product.price);
                    total_amount += unit_cost * quantity;
                    OrderDetail.create({ order_id, product_id, attributes, product_name, quantity, unit_cost });
                    Order.update({ total_amount }, { where: { order_id } });
                  });
                });

                Customer.findOne({ where: { customer_id } }).then(function (customer) {
                  const sgMail = require('@sendgrid/mail');
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = {
                    to: customer.email,
                    from: 'wajed_2009@hotmail.com',
                    cc: ['wajed@hagzi.com'],
                    subject: 'Ecommerce Turing Challenge Order',
                    html: '<strong>Ecommerce Turing Challenge Order</strong><br /><span>Total Amount : <b>' + total_amount + '</b></span>',
                  };
                  sgMail.send(msg);
                });
                return res.status(201).json({ order_id });
              });
            } else {
              return res.status(401).json({ error: { status: 401, message: "ddd" } });
            }
          });
        } else {
          return res.status(401).json({ error: { status: 401, message: result.message } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with order summary
   * @memberof ShoppingCartController
   */
  static async getOrder(req, res, next) {
    const { order_id } = req.params;  // eslint-disable-line
    try {
      // write code to get order
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { customer_id } = result.decoded;
          Order.findOne({
            where: { order_id, customer_id }
          }).then(function (order) {
            if (order) {
              OrderDetail.findAll({
                where: { order_id },
                attributes: [
                  'product_id', 'attributes', 'product_name', 'quantity', 'unit_cost',
                  [Sequelize.literal('quantity * unit_cost'), 'subtotal']
                ]
              }).then(function (order_items) {
                return res.status(200).json({ order_id, order_items });
              });
            } else {
              return res.status(404).json({ error: { status: 404, message: `Order with id ${order_id} does not exist` } });
            }
          });
        } else {
          return res.status(401).json({ error: { status: 401, message: result.message } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with customer's orders
   * @memberof ShoppingCartController
   */
  static async getCustomerOrders(req, res, next) {
    try {
      // write code to get order
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { customer_id } = result.decoded;
          Order.findAll({
            where: { customer_id }, include: [{ model: Customer, attributes: [] }],
            attributes: [
              'order_id', 'total_amount', 'created_on', 'shipped_on',
              [Sequelize.col('Customer.name'), 'name']
            ]
          }).then(function (orders) {
            return res.status(200).json(orders);
          });
        } else {
          return res.status(401).json({ error: { status: 401, message: result.message } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with order summary
   * @memberof ShoppingCartController
   */
  static async getOrderSummary(req, res, next) {
    const { order_id } = req.params;  // eslint-disable-line
    try {
      // write code to get order
      Auth.isAuthenticated(req, function (result) {
        if (result.status) {
          const { customer_id } = result.decoded;
          Order.findOne({
            where: { order_id, customer_id }, include: [{ model: Customer, attributes: [] }],
            attributes: [
              'order_id', 'total_amount', 'created_on', 'shipped_on', 'status',
              [Sequelize.col('Customer.name'), 'name']
            ]
          }).then(function (order) {
            if (order) {
              return res.status(200).json(order);
            } else {
              return res.status(404).json({ error: { status: 404, message: `Order with id ${order_id} does not exist` } });
            }
          });
        } else {
          return res.status(401).json({ error: { status: 401, message: result.message } });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async processStripePayment(req, res, next) {
    const { email, stripeToken, order_id } = req.body; // eslint-disable-line
    //const { customer_id } = req;  // eslint-disable-line
    try {
      // implement code to process payment and send order confirmation email here
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      stripe.charges.create({
        amount: 200,
        currency: "usd",
        source: stripeToken,
        description: "Charge for " + email,
        receipt_email: email,
        metadata: { 'order_id': order_id }
      }, function (err, charge) {
        if (err)
          return res.status(200).json(err);
        return res.status(200).json({ Message: 'process Stripe Payment', charge });
      });

    } catch (error) {
      return next(error);
    }
  }

  /**
 * @static
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  static async webhookStripePayment(req, res, next) {
    return res.status(200).json({ received: true });
  }

}

export default ShoppingCartController;