import { Router } from 'express';
import wrapAsync from 'src/http/wrapAsync';
import validateNewOrder from 'src/http/middlewares/requestInput/newOrder';
import validateOrderPayment from 'src/http/middlewares/requestInput/orderPayment';
import verifyToken from 'src/http/middlewares/auth/verifyToken';
import {
  createNewOrder,
  getSingleOrder,
  getCustomerOrders,
  getSingleOrderShortDetail,
  makeOrderPayment,
} from './controller';

const orderRouter = Router();

orderRouter.post('/orders',
  verifyToken,
  validateNewOrder,
  wrapAsync(createNewOrder));

orderRouter.get('^/orders/:orderId([0-9])',
  verifyToken,
  wrapAsync(getSingleOrder));

orderRouter.get('/orders/inCustomer',
  verifyToken,
  wrapAsync(getCustomerOrders));

orderRouter.get('/orders/shortDetail/:orderId',
  verifyToken,
  wrapAsync(getSingleOrderShortDetail));

orderRouter.post('/stripe/charge',
  validateOrderPayment,
  verifyToken,
  wrapAsync(makeOrderPayment));

export default orderRouter;
