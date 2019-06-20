import 'dotenv/config';
import asyncRedis from 'async-redis';
import Model from '../database/models';
import emailTemplates from '../helpers/mail/emailTemplates';
import sendMail from '../helpers/mail/sendMail';
import errorResponse from '../helpers/errorResponse';

const redisClient = asyncRedis.createClient(process.env.REDIS_URL);
const {
  Order, OrderDetail, Product, ShoppingCart
} = Model;
const {
  orderTemplateHtml, orderTemplateText
} = emailTemplates;

/**
 *
 *
 * @export
 * @class OrderController
 * @description Operations on Order
 */
export default class OrderController {
  /**
    * @description -This method creates an order
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {integer} - order_id
    */
  static async createOrder(req, res) {
    const {
      cart_id: cartId,
      shipping_id: shippingId,
      tax_id: taxId
    } = req.body;
    try {
      const cartItems = await ShoppingCart.findAll({
        where: { cart_id: cartId },
        attributes: [
          'item_id',
          'product_id',
          'attributes',
          'quantity'
        ],
        include: [{
          model: Product,
          attributes: [
            'name',
            'price',
            'discounted_price',
          ]
        }]
      });
      if (!cartItems.length) {
        return res.status(404).json({
          error: {
            status: 404,
            message: 'Cart id does not exist',
            field: 'cart id'
          }
        });
      }
      let totalAmount = 0;
      for (let i = 0; i < cartItems.length; i += 1) {
        const unitCost = (cartItems[i].dataValues.Product.price * cartItems[i].dataValues.quantity)
        - (cartItems[i].dataValues.Product.discounted_price * cartItems[i].dataValues.quantity)
          .toFixed(2).toString();
        totalAmount += unitCost;
      }
      const order = await Order.create({
        total_amount: totalAmount,
        created_on: new Date().toLocaleString(),
        status: 0,
        customer_id: req.user.id,
        shipping_id: shippingId,
        tax_id: taxId
      });
      cartItems.forEach(async (itemDetails) => {
        await OrderDetail.create({
          order_id: order.dataValues.order_id,
          product_id: itemDetails.product_id,
          attributes: itemDetails.dataValues.attributes,
          product_name: itemDetails.dataValues.Product.name,
          quantity: itemDetails.quantity,
          unit_cost: itemDetails.dataValues.Product.price
        });
      });
      await ShoppingCart.destroy({
        where: { cart_id: cartId }
      });
      redisClient.del(req.cacheKey);
      sendMail({
        from: process.env.MAIL_SENDER,
        to: req.user.email,
        subject: 'You Have Created A New Order',
        text: orderTemplateText(
          req.user.name,
          order.dataValues.order_id,
          totalAmount,
          process.env.BASE_URL
        ),
        html: orderTemplateHtml(
          req.user.name,
          order.dataValues.order_id,
          totalAmount,
          process.env.BASE_URL
        )
      });
      res.status(200).json({
        orderId: order.order_id
      });
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'ORD_500', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method gets the orders of a customer
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {array} - orders
    */
  static async ordersByCustomer(req, res) {
    try {
      let orders = await Order.findAll({
        where: { customer_id: req.user.id },
        attributes: [
          'order_id',
          'total_amount',
          'created_on',
          'shipped_on',
          'status',
          'name'
        ]
      });
      orders = orders.map((order) => {
        order.setDataValue('name', req.user.name);
        return order;
      });
      res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'ORD_500', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method gets info about an order
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {array} - order info
    */
  static async orderInfo(req, res) {
    try {
      const { order_id: orderId } = req.params;
      // eslint-disable-next-line
      if (isNaN(orderId)) {
        return res.status(400).json({
          error: {
            status: 400,
            message: 'Order id must be a number',
            field: 'order id'
          }
        });
      }
      const order = await Order.findOne({
        where: { order_id: orderId, customer_id: req.user.id },
        attributes: [],
        include: [{
          model: OrderDetail,
          attributes: [
            'order_id',
            'product_id',
            'attributes',
            'product_name',
            'quantity',
            'unit_cost'
          ],
          include: [{
            model: Product,
            attributes: [
              'discounted_price'
            ]
          }]
        }]
      });
      if (!order) {
        return res.status(404).json({
          error: {
            status: 404,
            message: 'Order id does not exist',
            field: 'order id'
          }
        });
      }
      let orderDetails = order.OrderDetails;
      orderDetails = orderDetails.map((detail) => {
        const subTotal = (detail.dataValues.unit_cost * detail.dataValues.quantity)
        - (detail.dataValues.Product.dataValues.discounted_price * detail.dataValues.quantity);
        detail.setDataValue('subtotal', subTotal.toFixed(2).toString());
        delete detail.dataValues.Product;
        return detail;
      });
      res.status(200).json(orderDetails);
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'ORD_500', error.parent.sqlMessage, ''));
    }
  }
}
