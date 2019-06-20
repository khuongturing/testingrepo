/* eslint no-restricted-globals: ["error", "event", "fdescribe"] */

import asyncRedis from 'async-redis';
import 'dotenv/config';
import generateUniqueId from '../helpers/generateUniqueId';
import Model from '../database/models';
import formatCartItems from '../helpers/formatCartItems';
import errorResponse from '../helpers/errorResponse';

const redisClient = asyncRedis.createClient(process.env.REDIS_URL);

const {
  ShoppingCart, Product
} = Model;

/**
 *
 *
 * @export
 * @class ShoppingCartControlle
 * @description Operations on Products
 */
export default class ShoppingCartController {
  /**
    * @description -This method generates a unique id
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - unique id
    */
  static async generateUniqueId(req, res) {
    try {
      const uniqueId = generateUniqueId(18);
      if (uniqueId) {
        return res.status(200).json({ cart_id: uniqueId });
      }
      return res.status(400).json(errorResponse(req, res, 400, 'SHP_04', 'Bad Request', ''));
    } catch (error) {
      return res.status(400).json(errorResponse(req, res, 400, 'SHP_04', 'Bad Request', ''));
    }
  }

  /**
    * @description -This method gets products in cart
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {array} - cart products
    */
  static async getProductsInCart(req, res) {
    try {
      const { cart_id: cartId } = req.params;
      const cartItems = await ShoppingCart.findAll({
        where: { cart_id: cartId },
        attributes: [
          'item_id',
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
      const formattedCartItems = formatCartItems(cartItems);
      if (!formattedCartItems.length) {
        res.status(200).json({ cart: formattedCartItems, message: 'Cart id does not exist' });
      } else {
        redisClient
          .setex(req.cacheKey, process.env.REDIS_TIMEOUT, JSON.stringify(formattedCartItems));
        res.status(200).json(formattedCartItems);
      }
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'SHP_05', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method adds a  product to cart
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {array} - adds a product to cart
    */
  static async addProductToCart(req, res) {
    try {
      const {
        cart_id: cartId,
        product_id: productId,
        attributes
      } = req.body;
      if (isNaN(productId)) {
        return res.status(400).json({
          error: {
            status: 400,
            message: 'Product id must be a number',
            field: 'product id'
          }
        });
      }
      const product = await Product.findOne({
        where: { product_id: productId },
      });
      if (product) {
        const existingCart = await ShoppingCart.findOne({
          where: { cart_id: cartId, product_id: productId, attribute: attributes },
        });
        if (!existingCart) {
          await ShoppingCart.create({
            cart_id: cartId,
            product_id: productId,
            quantity: 1,
            added_on: new Date().toLocaleString(),
            attribute: attributes,
          });
        } else {
          const newQuantity = existingCart.quantity + 1;
          await existingCart.update({
            cart_id: cartId,
            product_id: productId,
            quantity: newQuantity,
            added_on: new Date().toLocaleString(),
            attribute: attributes,
          });
        }
        const cartItems = await ShoppingCart.findAll({
          where: { cart_id: cartId },
          attributes: [
            'item_id',
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
        const formattedCartItems = formatCartItems(cartItems);
        redisClient
          .setex(req.cacheKey, process.env.REDIS_TIMEOUT, JSON.stringify(formattedCartItems));
        res.status(200).json(formattedCartItems);
      } else {
        return res.status(404).json({
          error: {
            status: 404,
            message: 'Product cannot be found',
          }
        });
      }
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'SHP_05', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method clears the cart
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {array} - empty cart
    */
  static async clearCart(req, res) {
    try {
      let { cart_id: cartId } = req.body;
      if (!cartId) {
        cartId = req.params.cart_id;
      }
      if (!cartId) {
        res.status(400).json({
          code: 'USR_02',
          message: 'The cart id is required',
          field: 'cart_id'
        });
      }
      await ShoppingCart.destroy({
        where: { cart_id: cartId }
      });
      redisClient.del(req.cacheKey);
      res.status(200).json([]);
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'SHP_05', error.parent.sqlMessage, ''));
    }
  }
}
