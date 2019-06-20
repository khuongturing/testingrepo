import 'dotenv/config';
import asyncRedis from 'async-redis';

const redisClient = asyncRedis.createClient(process.env.REDIS_URL);

const departmentsCaching = async (req, res, next, value) => {
  req.cacheKey = value;
  let response = await redisClient.get(req.cacheKey);
  if (response !== null) {
    response = JSON.parse(response);
    return res.status(200).json(response);
  }
  next();
};

export default {
  allDepartmentsCaching(req, res, next) {
    departmentsCaching(req, res, next, 'allDepartments');
  },
};
