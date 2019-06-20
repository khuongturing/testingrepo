import md5 from 'md5';
import response from 'src/http/response';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES,
} from 'src/config/constants';
import { ShoppingCart as ShoppingCartModel } from 'src/domains/models';
import shoppingCartTransformer from './transformer';
import shoppingCartRepository from './repository';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const generateUniqueId = async (req, res) => {
  const uniqueId = md5(new Date()).substring(0, 12);
  const data = {
    cart_id: uniqueId
  };
  return response.success(res, data);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const addProducToCart = async (req, res) => {
  const { cart_id: cartId } = req.body;
  const rows = await shoppingCartRepository.addProducToCart({ data: req.body, cartId });
  return response.success(res, shoppingCartTransformer.collection({ rows }));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getCartProducts = async (req, res) => {
  const { cartId } = req.params;
  const rows = await shoppingCartRepository.getCartProducts({ cartId });
  if (!rows.length) {
    throw httpException.handle(ERROR_CODES.CAR_03);
  }
  return response.success(res, shoppingCartTransformer.collection({ rows }));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const cartItem = await ShoppingCartModel.findByPk(itemId);

  if (!cartItem) {
    throw httpException.handle(ERROR_CODES.CAR_02);
  }
  const { quantity = cartItem.quantity } = req.body;
  await cartItem.update({ quantity });
  const rows = await ShoppingCartModel.findCartItems({ cartId: cartItem.cart_id });

  return response.success(res, shoppingCartTransformer.collection({ rows }));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const clearCartItems = async (req, res) => {
  const { cartId } = req.params;

  const deleted = await ShoppingCartModel.emptyCart(cartId);
  if (deleted < 1) {
    throw httpException.handle(ERROR_CODES.CAR_03);
  }

  return response.success(res);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getTotalAmountForCart = async (req, res) => {
  const { cartId } = req.params;
  const total_amount = await ShoppingCartModel.getTotalAmountForCart({ cartId });
  if (!total_amount) {
    throw httpException.handle(ERROR_CODES.CAR_03);
  }
  return response.success(res, { total_amount });
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const saveItemForLater = async (req, res) => {
  const { itemId } = req.params;
  const cartItem = await ShoppingCartModel.findByPk(itemId);
  if (!cartItem) {
    throw httpException.handle(ERROR_CODES.CAR_02);
  }
  await cartItem.update({ buy_now: false });
  return response.success(res);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getItemsSavedForLater = async (req, res) => {
  const { cartId } = req.params;
  const rows = await shoppingCartRepository.getCartProducts({ cartId, scope: 'savedForLater' });
  if (!rows.length) {
    throw httpException.handle(ERROR_CODES.CAR_03);
  }
  return response.success(res, shoppingCartTransformer.collection({ rows }));
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const removeItemFromCart = async (req, res) => {
  const { itemId } = req.params;
  const cartItem = await ShoppingCartModel.findByPk(itemId);
  if (!cartItem) {
    throw httpException.handle(ERROR_CODES.CAR_02);
  }
  await cartItem.destroy();
  return response.success(res);
};
