import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';
let UtilityHelper = require('../../lib/utilityHelper')

const router = Router();
router.get('/shoppingcart/generateUniqueId', UtilityHelper.validateToken, ShoppingCartController.generateUniqueCart);
router.post('/shoppingcart/add', UtilityHelper.validateToken, ShoppingCartController.addItemToCart);
router.get('/shoppingcart/:cart_id',UtilityHelper.validateToken, ShoppingCartController.getCart);
router.get('/shoppingcart/saveForLater/:item_id',UtilityHelper.validateToken, ShoppingCartController.saveForLater);
router.get('/shoppingcart/getSaved/:cart_id',UtilityHelper.validateToken, ShoppingCartController.getSaved);
router.get('/shoppingcart/moveToCart/:item_id',UtilityHelper.validateToken, ShoppingCartController.moveToCart);
router.get('/shoppingcart/totalAmount/:cart_id',UtilityHelper.validateToken, ShoppingCartController.getTotalAmount);
router.put('/shoppingcart/update/:item_id', UtilityHelper.validateToken, ShoppingCartController.updateCartItem);
router.delete('/shoppingcart/empty/:cart_id', UtilityHelper.validateToken, ShoppingCartController.emptyCart);
router.delete('/shoppingcart/removeProduct/:item_id', UtilityHelper.validateToken, ShoppingCartController.removeItemFromCart);


router.post('/orders',UtilityHelper.validateToken, ShoppingCartController.createOrder);
router.get('/orders/inCustomer', UtilityHelper.validateToken, ShoppingCartController.getCustomerOrders);
router.get('/orders/shortDetail/:order_id', UtilityHelper.validateToken, ShoppingCartController.getOrderSummary);
router.get(
  '/orders/:order_id', UtilityHelper.validateToken, ShoppingCartController.getOrder
);
router.post(
  '/stripe/charge', UtilityHelper.validateToken, ShoppingCartController.processStripePayment
);

router.post(
  '/stripe/webhooks', ShoppingCartController.stripeWebHook
);

export default router;
