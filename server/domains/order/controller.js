import response from 'src/http/response';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES,
} from 'src/config/constants';
import {
  Order as OrderModel,
  Customer as CustomerModel,
} from 'src/domains/models';
import paymentService from 'src/services/payment';

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const createNewOrder = async (req, res) => {
  const { id: customer_id } = req.decoded;
  const data = req.body;
  data.customer_id = customer_id;
  try {
    const responseData = await OrderModel.createOrder(data);
    return response.success(res, responseData);
  } catch (error) {
    if (error.message === 'Wrong Shipping ID') {
      throw httpException.handle(ERROR_CODES.ORD_02);
    } else if (error.message === 'Wrong Tax ID') {
      throw httpException.handle(ERROR_CODES.ORD_03);
    } else if (error.message === 'No Item for Cart') {
      throw httpException.handle(ERROR_CODES.ORD_04);
    }
    throw error;
  }
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const makeOrderPayment = async (req, res) => {
  const { body: data } = req;
  const { order_id: orderId } = data;
  const { id: customerId } = req.decoded;

  const order = await OrderModel.findByPk(orderId);

  if (!order) {
    throw httpException.handle(ERROR_CODES.ORD_05);
  }
  if (order.status === 1) {
    throw httpException.handle(ERROR_CODES.ORD_06);
  }

  const authCustomer = await CustomerModel.getAuthUser(customerId);
  data.receiptEmail = authCustomer.email;

  const paymentResponse = await paymentService.makeOrderPayment(data);

  if (paymentResponse.paid !== true) {
    throw httpException.handle(ERROR_CODES.ORD_07);
  }

  const updatedOrder = await order.completeOrder(order);
  return response.success(res, updatedOrder);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getSingleOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await OrderModel.findByPk(orderId);
  return response.success(res, order);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getSingleOrderShortDetail = async (req, res) => {
  const { orderId } = req.params;
  const order = await OrderModel.findByPk(orderId, {
    attributes: ['order_id', 'total_amount', 'created_on', 'shipped_on', 'status']
  });
  return response.success(res, order);
};

/**
 * @param {Object} req - request
 * @param {Object} res - server response
 * @returns {Object} - server response with status code and|or body
 */
export const getCustomerOrders = async (req, res) => {
  const { id: customer_id } = req.decoded;
  const orders = await OrderModel.getCustomerOrders({ customer_id });
  return response.success(res, orders);
};
