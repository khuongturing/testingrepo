import 'dotenv/config';
import asyncRedis from 'async-redis';

const redisClient = asyncRedis.createClient(process.env.REDIS_URL);

const categoriesCaching = async (req, res, next, value) => {
  req.cacheKey = `${value}${req.cacheKeyPrefix}`;
  let response = await redisClient.get(req.cacheKey);
  if (response !== null) {
    response = JSON.parse(response);
    return res.status(200).json(response);
  }
  next();
};

export default {
  allCategoriesCaching(req, res, next) {
    categoriesCaching(req, res, next, 'allCategories');
  },
};
