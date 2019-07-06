/**
 * This module contains the winston logger configuration.
 */
const winston = require('winston')
const config = require('config')

const logger = winston.createLogger({
  level: config.get('LOG.LOG_LEVEL'),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Write errors to error.log
    new winston.transports.File({ filename: 'combined.log' }) // Write all logs to combined.log
  ]
})
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  })) // Log to console if not in production
}

module.exports = logger
