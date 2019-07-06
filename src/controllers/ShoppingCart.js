import Sequelize from 'sequelize';
import models from '../../models/';
import { errorResponse } from '../utils/errors';
import { checkEmpty } from '../utils/helpers';
const { ShoppingCart, Product } = models;

const Op = Sequelize.Op;

/**
 * @description: A class containing all the ShoppingCart controllers
 *
 * @class: ShoppingCartController
 *
 */
class ShoppingCartController{

    /**
    * @description: This method generates Unique ID's for cart
    *
    * @method: generateUniqueId
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing the generated Unique ID's
    */
    static generateUniqueId = async(req, res, next) =>{
        try {
            const createId = () => {
                const randomId = '1xh7q2z4qajwjy' + Math.random().toString(36).substr(2, 4);
                return randomId
            };
            const cart_id = createId()
            res.json({ cart_id })
        } catch (err) {
            next()
        }
    }
    

    /**
    * @description: This method gets enables a product to be added to 
    * a cart
    *
    * @method: addProductToCart
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing an list of product in a cart
    */
    static addProductToCart = async(req, res, next) =>{
        const productCart = []
        try {
            const added_on = new Date()
            const { cart_id, product_id, attributes } = req.body
            const error = checkEmpty([
                { cart_id },
                { product_id },
                { attributes }])
            if (error) {
                return res.status(400).json(
                    errorResponse("PRO_04", 400, error.message, error.name)
                )
            }
            const product = await Product.findByPk(product_id)
            if (!product) {
                return res.status(404).send(
                    errorResponse("PRO_01", 404,
                        "Don't exist product with this ID..",
                        "product_id")
                )
            }
            const cart = await ShoppingCart.create({
                cart_id, product_id: product.product_id, attributes, added_on
            })
            productCart.push(cart)
            res.status(201).json(productCart)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets a list of product in a cart
    *
    *
    * @method: cartList
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing an list of product in a cart
    */
    static cartList = async(req, res, next) => {
        const productList = []
        try {
            const { cart_id } = req.params
            const cart = await ShoppingCart.findAll({
                where: { cart_id },
                include: [{
                    model: Product,
                    attributes: ['name', 'image', 'price']
                }]
            })
            cart.forEach(element => {
                const { item_id, attributes, product_id,
                    quantity, Products } = element
                const obj = {
                    item_id, name: Products[0].name, attributes,
                    product_id, image: Products[0].image,
                    price: Products[0].price, quantity,
                    subtotal: Products[0].price
                }
                productList.push(obj)
            });
            res.json(productList)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets enables a cart to be updated.
    *
    * @method: updateCart
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing an updated cart.
    */
    static updateCart = async(req, res) => {
        const { params, body } = req
        const { item_id } = params
        const { quantity } = body
        const error = checkEmpty([
            { quantity }])
        if (error) {
            return res.status(400).json(
                errorResponse("PRO_04", 400, error.message, error.name)
            )
        }
        try {
            const item = await ShoppingCart.findOne({
                where: { item_id }
            })
            if (!item) {
                return res.status(404).send(
                    errorResponse("SHO_01", 404,
                        "Don't exist item with this ID.",
                        "item Id")
                )
            }
            await item.update({ quantity })
            const { cart_id } = item
            const cartList = await ShoppingCart.findAll({
                where: { cart_id }
            })
            res.json(cartList)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets enables a cart to be deleted.
    *
    * @method: deleteCart
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {array} response containing an empty array.
    */
    static deleteCart = async(req, res, next) =>{
        const { cart_id } = req.params
        try {
            const cart = await ShoppingCart.findOne({
                where: { cart_id }
            })
            if (!cart) {
                return res.status(404).send(
                    errorResponse("SHO_02", 404,
                        "Don't exist cart with this ID.",
                        "cart Id")
                )
            }
            await ShoppingCart.destroy({
                where: { cart_id }
            })
            res.status(200).json([])
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets the total amount of product by price
    * a cart.
    *
    * @method: cartTotalAmount
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing an object. The total amount of 
    * all the products in a cart.
    */
    static cartTotalAmount = async(req, res, next) => {
        const productList = []
        try {
            const { cart_id } = req.params
            const cart = await ShoppingCart.findAll({
                where: { cart_id },
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            })
            cart.forEach(data => {
                const { Products } = data
                const price = Products[0].price
                productList.push(price)
            });
            const prices = productList.map(Number);
            const total = prices.reduce(function (a, b) {
                return a + b;
            }, 0);
            const total_amount = total.toString()
            res.json({ total_amount })
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets enables an Item to be saved for later purchase.
    *
    * @method: saveItemForLater
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {array} response containing an array of object.
    */
    static saveItemForLater = async(req, res, next) => {
        try {
            const { item_id } = req.params
            const item = await ShoppingCart.findOne({
                where: { item_id }
            })
            if (!item) {
                return res.status(404).json(
                    errorResponse("SHO_01", 404,
                        "Don't exist item with this ID.",
                        "item Id")
                )
            }
            await item.update({ buy_now: false })
            res.json({msg: "Item saved"})
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets all the items saved for later purchase.
    *
    * @method: getSavedItems
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {array} response containing an array of object.
    */
    static async getSavedItems(req, res, next) {
        try {
            const { cart_id } = req.params
            const cart = await ShoppingCart.findOne({
                where: { cart_id }
            })
            if(!cart) {
                return res.status(404).send(
                    errorResponse("SHO_01", 404,
                        "Don't exist cart with this ID.",
                        "cart Id")
                )
            }
            const savedItemsInCart = await ShoppingCart.findAll({
                where: {
                    cart_id: {
                        [Op.eq]: cart.cart_id
                    },
                    buy_now: {
                        [Op.eq]: false
                    }
                }
            })
            res.json(savedItemsInCart)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets ensures a product can be removed from a cart
    *
    * @method: removeProductInCart
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    */
    static async removeProductInCart(req, res, next) {
        const { item_id } = req.params
        try {
            const item = await ShoppingCart.findOne({
                where: { item_id }
            })
            if (!item) {
                return res.status(404).send(
                    errorResponse("SHO_01", 404,
                        "Don't exist item with this ID.",
                        "item Id")
                )
            }
            await ShoppingCart.destroy({
                where: { item_id }
            })
            return res.json({ msg: `Item with ID: ${item_id} has been removed from cart` })
        } catch (err) {
            next()
        }
    }
}

export default ShoppingCartController;
