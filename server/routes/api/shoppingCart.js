import express from 'express';
import ShoppingCartController from '../../controllers/shoppingCartController';
import { addCacheKey, allItemsInShoppingCartCaching } from '../../middlewares/caching/shoppingCartCaching';

const router = express.Router();
router.get('/shoppingcart/generateUniqueId', ShoppingCartController.generateUniqueId);
router.get('/shoppingcart/:cart_id', addCacheKey, allItemsInShoppingCartCaching, ShoppingCartController.getProductsInCart);
router.post('/shoppingcart/add', addCacheKey, ShoppingCartController.addProductToCart);
router.delete('/shoppingcart/empty/:cart_id', addCacheKey, ShoppingCartController.clearCart);

export default router;
