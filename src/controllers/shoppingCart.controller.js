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
import {
  Product,
  ShoppingCart,
  Shipping,
  Tax,
  Customer,
  Order,
  OrderDetail,
  Sequelize,
} from '../database/models';
let {stripe_api_key} = require('../config/settings')
import uniqueId from 'uniqid';
let stripe =  require('stripe')(stripe_api_key)
import {add, update, order, payment} from '../validators/shopping.validator';
let {roundTo} = require('../lib/helpers')
let log = require('fancy-log');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus');
let Response = require('../lib/responseManager');
const { Op } = Sequelize;
 
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
    let cart_id = uniqueId();
    return Response.success(res, {cart_id});
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
    let {body, body: {cart_id, product_id, quantity, attributes}} = req;
    try{
      await add(res, body);
      let item = await ShoppingCartController._getItem(cart_id, product_id);
      if(!item) {
        await ShoppingCart.create(body)
      }else{
        let old_quantity = item.quantity;
        let new_quantity = old_quantity + quantity;
        await ShoppingCart.update({quantity: new_quantity}, {where: {item_id: item.item_id}})
      }
      let cart_items = await ShoppingCartController._getAllItemsInCart(body.cart_id);
      return Response.success(res, {cart_items})
    }catch(error){
      log.error(`Error Adding Item to Cart ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  static async _getItem(cart_id, product_id){
    let item = await ShoppingCart.findOne({
      where: {cart_id, product_id}
    });
    return item
  }


  static async _getAllItemsInCart(cart_id){
    try{
      let cart_items = await ShoppingCart.findAll({
        where: {cart_id},
        include: [Product]
      });


      return cart_items.map(c_item => {
        let product = c_item.Product;
        let x = {
          item_id: c_item.item_id,
          product_id: c_item.product_id,
          attributes: c_item.attributes,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: c_item.quantity,
          subtotal: c_item.quantity * product.price
        }
        return x;
        
      })
    }catch(error){
      throw error(error)
    }
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

    let {cart_id} = req.params;
    if(!cart_id)
    return Response.failure(res, responseMessages.CART_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'cart_id');

    try{
      let cart_items = await ShoppingCartController._getAllItemsInCart(cart_id);
      return Response.success(res, {cart_items});
    }catch(error){
      log.error(`Error Getting Items in a Cart ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
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
    const { item_id } = req.params
    let {body} = req
    if(!item_id || typeof parseInt(item_id) !== "number")
      return Response.failure(res, responseMessages.ITEM_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'item_id');

    try{
      await update(res, body);
      await ShoppingCart.update(body, {where: {item_id}});
      let item = await ShoppingCart.findByPk(item_id);
      let cart_items = await ShoppingCartController._getAllItemsInCart(item.cart_id);
      return Response.success(res, {cart_items});
    }catch(error){
      log.error(`Error Updating Item in a Cart ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
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
    const { cart_id } = req.params
    if(!cart_id)
      return Response.failure(res, responseMessages.CART_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'item_id');
    try{
      await ShoppingCart.destroy({
        where: {cart_id}
      });
      return Response.success(res, []);
    }catch(error){
      log.error(`Error Emptying Cart ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Save Item for Later
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async saveForLater(req, res, next) {
    const { item_id } = req.params
    if(!item_id || typeof parseInt(item_id) !== "number")
      return Response.failure(res, responseMessages.ITEM_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'item_id');
    try{
      await ShoppingCart.update({buy_now: false},{where: {item_id}});
      return Response.success(res, []);
    }catch(error){
      log.error(`Error Saving Item For Later ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Get Saved Product
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async getSaved(req, res, next) {
    const { cart_id } = req.params
    if(!cart_id)
      return Response.failure(res, responseMessages.CART_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'cart_id');
    try{
      let saved_items = await ShoppingCart.findAll({
        where: {
          cart_id, buy_now: false
        }
      })
      return Response.success(res, {saved_items});
    }catch(error){
      log.error(`Error getting saved items ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Move Saved Product to Cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async moveToCart(req, res, next) {
    const { item_id } = req.params
    if(!item_id || typeof parseInt(item_id) !== "number")
      return Response.failure(res, responseMessages.ITEM_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'item_id');
    try{
      await ShoppingCart.update({buy_now: true}, {where: {item_id}})
      return Response.success(res, []);
    }catch(error){
      log.error(`Error Moving Saved Item to cart ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
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
    const { item_id } = req.params
    if(!item_id || typeof parseInt(item_id) !== "number")
      return Response.failure(res, responseMessages.ITEM_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'item_id');
    try{
      await ShoppingCart.destroy({
        where: {item_id}
      })
      return Response.success(res, []);
    }catch(error){
      log.error(`Error Moving Saved Item to cart ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Calculate Total Amount
   * cart id is obtained from current session
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with message
   * @memberof ShoppingCartController
   */
  static async getTotalAmount(req, res, next) {
    const { cart_id } = req.params
    if(!cart_id)
      return Response.failure(res, responseMessages.CART_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'cart_id');
    try{
      let products = await ShoppingCartController._getProductsInCart(cart_id)
      let total_amount = await ShoppingCartController._getTotalGoodsPrice(products);
      return Response.success(res, {total_amount});

    }catch(error){
      log.error(`Error Calculating Cart total ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  static async _getTotalGoodsPrice(items){
    try{
      
      let reducer =  (accumulator, item) => {
        let pdt = item.Product;
        let subtotal = item.quantity * pdt.price;
        return accumulator + subtotal;
      }

      let total_amount = items.reduce(reducer, 0);
      return roundTo(total_amount, 2)
    }catch(error){
      throw Error(error);
    }
  }

  static async _getProductsInCart(cart_id){
    try{
      let items = await ShoppingCart.findAll({
        where: {cart_id, buy_now: true},
        include: [Product]
      });
      return items;
    }catch(error){
      throw Error(error)
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
    let {body, customer_id, body: {tax_id, shipping_id, cart_id}} = req;
    try {
        await order(res, body);
        let products_in_cart = await ShoppingCartController._getProductsInCart(cart_id);
        let price_of_products_in_cart = await ShoppingCartController._getTotalGoodsPrice(products_in_cart);
        let total_amount = await ShoppingCartController._calculateTotalOrderPrice(price_of_products_in_cart, tax_id, shipping_id);

        let new_order = {
          customer_id,
          shipping_id, tax_id, total_amount
        };
        let created_order = await Order.create(new_order);
        await ShoppingCartController._pushOrderDetail(created_order.order_id, products_in_cart)
        return Response.success(res, {order_id: created_order.order_id})
      } catch (error) {
        log.error(`Error Creating Order ${error}`);
        return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)    }
  }

  static async _pushOrderDetail(order_id, products_in_cart){
    let order_details = products_in_cart.map(item => {
      let pdt = item.Product;
      return {
        order_id,
        product_id: pdt.product_id,
        attributes: item.attributes,
        product_name: pdt.name,
        quantity: item.quantity,
        unit_cost: pdt.price
      };
    })
    return await OrderDetail.bulkCreate(order_details);
  }

  static async _getTaxPercentage(tax_id){
    try{
      let tax = await Tax.findByPk(tax_id);
      if(!tax) return Response.failure(res, responseMessages.TAX_NOT_EXISTS, HttpStatus.NOT_FOUND, 'tax_id');

      return tax.tax_percentage;
    }catch(error){
      throw Error(error);
    }
  }

  static async _getShippingFee(shipping_id){
    try{
      let shipping = await Shipping.findByPk(shipping_id);
      if(!shipping) return Response.failure(res, responseMessages.SHIPPING_NOT_EXISTS, HttpStatus.NOT_FOUND, 'tax_id');

      return shipping.shipping_cost;
    }catch(error){
      throw Error(error);
    }
  }

  static async _calculateTotalOrderPrice(total_product_price, tax_id, shipping_id){
    let tax_percentage = await ShoppingCartController._getTaxPercentage(tax_id);
    let shipping_cost = await ShoppingCartController._getShippingFee(shipping_id);

    let tax = (parseInt(tax_percentage) / 100) * total_product_price;
    let total_order_price = total_product_price + tax + parseInt(shipping_cost);
    return roundTo(total_order_price, 2);
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with order details
   * @memberof ShoppingCartController
   */
  static async getOrder(req, res, next) {
    const { order_id } = req.params; 
    if(!order_id || typeof parseInt(order_id) !== "number")
    return Response.failure(res, responseMessages.ORDER_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'order_id');

    try {
      let order_items = await Order.findByPk(order_id, {
        include: [
          {
            model: OrderDetail,
            as: 'orderItems'
          }
        ]
      })
      let orderPdts = order_items.orderItems;
      orderPdts = orderPdts.map(pdt => {
        return{
          product_id: pdt.product_id,
          product_name: pdt.name,
          unit_cost: pdt.unit_cost,
          quantity: pdt.quantity,
          attributes: pdt.attributes,
          subtotal: roundTo(pdt.quantity * roundTo(pdt.unit_cost, 2), 2)
        }
      })
      order_items = {
        order_id: order_items.order_id,
        total_amount: order_items.total_amount,
        status: order_items.status,
        orderItems: orderPdts,
        shipping_id: order_items.shipping_id,
        tax_id: order_items.tax_id,
      }
      return Response.success(res, {order: order_items})
    } catch (error) {
      log.error(`Error Getting Order Info ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)    
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
    const { customer_id } = req;
    try {
      let customer_orders = await Order.findAll({
        where: {customer_id},
        include: [
          {
            model: Shipping,
          },
          {
            model: OrderDetail,
            as: 'orderItems'
          }
        ]
      })
      return Response.success(res, {customer_orders})
    } catch (error) {
      log.error(`Error Getting Order Info ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)    
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
    const { order_id } = req.params;
    if(!order_id || typeof parseInt(order_id) !== "number")
    return Response.failure(res, responseMessages.ORDER_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'order_id');

    try {
      let order = await Order.findByPk(order_id);
      order = {
        order_id: order.order_id,
        total_amount: order.total_amount,
        created_on: order.created_on,
        shipped_on: order.shipped_on,
        status: order.status
      }
      return Response.success(res, {order})
    } catch (error) {
      log.error(`Error Getting Order Summary ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)    
    }
  }

  /**
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async processStripePayment(req, res, next) {
    const { body, customer_id, customer_email, body: {
      stripeToken,
      order_id,
      description,
      amount,
      currency
    } } = req;
    try {
      await payment(res, body);
      let order_w_customer = await Order.findByPk(order_id);
      if(!order_w_customer) return Response.failure(res, responseMessages.ORDER_NOT_EXISTS, HttpStatus.NOT_FOUND, 'order_id')
      let total_amount = order_w_customer.total_amount;

      if(order_w_customer.status === 1) return Response.failure(res, responseMessages.ORDER_HAS_BEEN_PAID_FOR, HttpStatus.FORBIDDEN)
      if(roundTo(amount, 2) !== roundTo(total_amount, 2)) return Response.failure(res, responseMessages.AMOUNT_NOT_EQUAL_TO_PRICE, HttpStatus.BAD_REQUEST, 'amount')
      let charge = await stripe.charges.create({
        amount: roundTo(amount, 2) * 100,
        currency: currency || 'usd',
        description,
        source: stripeToken,
        statement_descriptor: 'Order Receipt',
        receipt_email: customer_email,
        metadata: {
          order_id, customer_id
        }
      });
      await Order.update({
        status: 1,
        reference: charge.id
      }, {where: {order_id}});

      charge = {
        order_id,
        status: 1,
        reference: charge.id, total_amount
      }
      return Response.success(res, charge )
    } catch (error) {
      log.error(`Error Charging customer ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)        }
  }

  /**
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async stripeWebHook(req, res, next) {
    let {body:event} = req;
    try{
    let {order_id, customer_id} = event.data.metadata;

    switch(event.type){
      case 'charge.failed':
        await Order.update({
          status: 2
        }, {where: {order_id}})
        break;
      case 'charge.succeeded':
          await Order.update({
            status: 1
          }, {where: {order_id}});
          break;
      default:
        break;

    }
  }catch(error){
    log.error(`Error with Stripe Webhook ${error}`)
  }
  }

}

export default ShoppingCartController;
