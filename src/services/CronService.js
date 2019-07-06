const CronJob = require('cron').CronJob
const config = require('config')
const dbPool = require('./MySqlService')
const logger = require('../common/logger')
const util = require('util')

new CronJob(config.get('CRON.CRON_TIME'), async function clearOldCarts(){
  try {
    await dbPool.query(`call ${config.get('STORED_PROCEDURES.DELETE_OLD_SHOPPING_CARTS')}(?)`, config.get('CRON.CLEAR_CARTS_OLDER_THAN'))
    logger.info('Cleared old shopping carts')
  } catch(e) {
    logger.error('Failed to clear old carts')
    logger.error(util.inspect(e))
  }
}, null, true, config.get('CRON.TIME_ZONE'))