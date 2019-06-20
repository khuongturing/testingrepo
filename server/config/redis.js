import redis from 'redis';
import bluebird from 'bluebird';
import logger from 'src/utils/logger';
import { REDIS_URL } from 'src/config/constants';

bluebird.promisifyAll(redis);

const redisClient = redis.createClient(REDIS_URL);

redisClient.on('connect', function () {
  logger.info('success connecting to redis');
});

redisClient.on('error', function (err) {
  logger.info(`fail connecting to redis ${err}`);
});

export default redisClient;
