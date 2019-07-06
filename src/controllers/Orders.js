import models from '../../models/';
import { errorResponse } from '../utils/errors';
import { checkEmpty } from '../utils/helpers';

const { 
    ShoppingCart, Orders, 
    OrderDetail, Customer, Product 
} = models;

/**
 * @description: A class containing all the Orders controllers
 *
 * @class: OrdersController
 *
 */
class OrdersController {
    /**
    * @description: This method enables a customer to create a new order
    *
    * @method: createOrder
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {string} response containing the order Id
    */
    static createOrder = async (req, res, next) => {
        const list = []
        const amount = []
        try {
            const { cart_id, shipping_id, tax_id } = req.body
            const error = checkEmpty([
                { cart_id },
                { shipping_id },
                { tax_id }])
            if (error) {
                return res.status(400).json(
                    errorResponse("ORD_02", 400, error.message, error.name)
                )
            }
            const { customerId } = req.user
            const created_on = new Date()
            const customer = await Customer.findByPk(customerId)
            if (!customer) {
                return res.status(404).send(
                    errorResponse("USR_10", 404,
                        "Don't exist customer with id", "customer_id")
                )
            }
            const cart = await ShoppingCart.findAll({
                where: { cart_id },
                include: [{ model: Product }]
            })
            cart.forEach(data => {
                const obj = {}
                const { Products } = data
                const addItemPrices = Number(Products[0].price) * data.quantity
                obj.unit_cost = Products[0].price
                obj.product_id = Products[0].product_id
                obj.product_name = Products[0].name
                obj.quantity = data.quantity
                obj.attributes = data.attributes
                list.push(obj)
                amount.push(addItemPrices)
            });
            const total_amount = amount.reduce((a, b) => a + b, 0);
            const order = await Orders.create({
                customer_id: customerId, shipping_id, total_amount,
                created_on, tax_id
            })
            list.forEach(data => {
                data.order_id = order.order_id
            })
            await OrderDetail.bulkCreate(list)
            return res.json({ orderId: order.order_id })
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets the information about a customer order
    *
    * @method: customerOrderInfo
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {string} response containing the order info
    */
    static customerOrderInfo = async (req, res, next) => {
        const orderList = []
        try {
            const { order_id } = req.params
            const customer_id = req.user.customerId
            const customer = await Customer.findByPk(customer_id)
            if (!customer) {
                return res.status(404).send(
                    errorResponse("USR_10", 404,
                        "Don't exist customer with id", "customer_id")
                )
            }
            const order = await OrderDetail.findAll({
                where: { order_id },
                attributes: { exclude: ['item_id'] }
            })
            order.forEach(data => {
                const obj = {}
                const { order_id, product_id, attributes,
                    product_name, quantity, unit_cost
                } = data
                obj.order_id = order_id
                obj.product_id = product_id
                obj.attributes = attributes
                obj.product_name = product_name
                obj.quantity = quantity
                obj.unit_cost = unit_cost
                obj.subtotal = Number(unit_cost) * quantity
                orderList.push(obj)
            })
            res.json(orderList)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets order by a customer
    *
    * @method: orderByCustomers
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {string} response containing orders by a customer
    */
    static orderByCustomers = async (req, res, next) => {
        try {
            const customer_id = req.user.customerId
            if (!customer) {
                return res.status(404).send(
                    errorResponse("USR_10", 404,
                        "Don't exist customer with id", "customer_id")
                )

            }
            const orders = await Orders.findAll({
                where: { customer_id }
            })
            return res.json(orders)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets extra information about an order
    *
    * @method: ordersShortDetail
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {string} response containing information object
    */
    static ordersShortDetail = async (req, res, next) => {
        const obj = {}
        try {
            const { order_id } = req.params
            const customer_id = req.user.customerId
            const customer = await Customer.findByPk(customer_id)
            if (!customer) {
                return res.status(404).send(
                    errorResponse("USR_10", 404,
                        "Don't exist customer with id", "customer_id")
                )
            }
            const order = await Orders.findOne({
                where: { order_id },
                attributes: ['order_id', 'total_amount', 'created_on', 'shipped_on', 'status'],
                include: [{
                    model: OrderDetail,
                    attributes: ['product_name']
                }]
            })
            if(!order) {
                return res.status(404).send(
                    errorResponse("ORD_01", 404,
                        "Don't exist order with id", "order_id")
                )
            }
            obj.order_id = order.order_id
            obj.total_amount = order.total_amount
            obj.created_on = order.created_on
            obj.shipped_on = order.shipped_on
            obj.status = order.status
            obj.name = order.OrderDetail.product_name
            res.json(obj)
        } catch (err) {
            next()
        }
    }
}

export default OrdersController;
