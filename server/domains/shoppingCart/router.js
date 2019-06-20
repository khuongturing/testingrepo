import { Router } from 'express';
import wrapAsync from 'src/http/wrapAsync';
import validateNewCartItem from 'src/http/middlewares/requestInput/newCartItem';
import {
  generateUniqueId,
  addProducToCart,
  getCartProducts,
  updateCartItem,
  clearCartItems,
  getTotalAmountForCart,
  saveItemForLater,
  getItemsSavedForLater,
  removeItemFromCart,
} from './controller';

const cartRouter = Router();

cartRouter.get('/shoppingcart/generateUniqueId',
  wrapAsync(generateUniqueId));

cartRouter.post('/shoppingcart/add',
  validateNewCartItem,
  wrapAsync(addProducToCart));

cartRouter.get('/shoppingcart/:cartId',
  wrapAsync(getCartProducts));

cartRouter.put('/shoppingcart/update/:itemId',
  wrapAsync(updateCartItem));

cartRouter.delete('/shoppingcart/empty/:cartId',
  wrapAsync(clearCartItems));

cartRouter.get('/shoppingcart/totalAmount/:cartId',
  wrapAsync(getTotalAmountForCart));

cartRouter.get('/shoppingcart/saveForLater/:itemId',
  wrapAsync(saveItemForLater));

cartRouter.get('/shoppingcart/getSaved/:cartId',
  wrapAsync(getItemsSavedForLater));

cartRouter.delete('/shoppingcart/removeProduct/:itemId',
  wrapAsync(removeItemFromCart));

export default cartRouter;
