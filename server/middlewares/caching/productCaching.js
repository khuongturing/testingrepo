import 'dotenv/config';
import asyncRedis from 'async-redis';

const redisClient = asyncRedis.createClient(process.env.REDIS_URL);

const productsCaching = async (req, res, next, value) => {
  req.cacheKey = `${value}${req.cacheKeyPrefix}`;
  let response = await redisClient.get(req.cacheKey);
  if (response !== null) {
    response = JSON.parse(response);
    return res.status(200).json(response);
  }
  next();
};

export default {
  allProductsCaching(req, res, next) {
    productsCaching(req, res, next, 'allProducts');
  },

  searchProductsCaching(req, res, next) {
    productsCaching(req, res, next, 'searchProducts');
  },

  categoryProductsCaching(req, res, next) {
    productsCaching(req, res, next, `categoryProducts${req.params.categoryId}`);
  },

  departmentProductsCaching(req, res, next) {
    productsCaching(req, res, next, `departmentProducts${req.params.departmentId}`);
  },
};
