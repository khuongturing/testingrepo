import 'dotenv/config';
import asyncRedis from 'async-redis';

const redisClient = asyncRedis.createClient(process.env.REDIS_URL);

const shoppingCartCaching = async (req, res, next, value) => {
  req.cacheKey = value;
  let response = await redisClient.get(req.cacheKey);
  if (response !== null) {
    response = JSON.parse(response);
    return res.status(200).json(response);
  }
  next();
};

export const addCacheKey = (req, res, next) => {
  let { cart_id: cartId } = req.body;
  if (!cartId) {
    cartId = req.params.cart_id;
  }
  req.cacheKey = `allProductsInShoppingCart-${cartId}`;
  next();
};

export const allItemsInShoppingCartCaching = (req, res, next) => {
  shoppingCartCaching(req, res, next, req.cacheKey);
};
