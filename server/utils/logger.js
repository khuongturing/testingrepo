import winston from 'winston';
import { DEBUG } from 'src/config/constants';

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ]
});

/**
 * Console logger used throughout the app
 * @exports
 */
export default {
  /**
   * @param {*} data - the data to be logged
   * @returns {void}
   */
  info(data) {
    if (DEBUG === 'true') {
      winstonLogger.info(data);
    }
  },
  /**
   * @param {*} data - the data to be logged
   * @returns {void}
   */
  error(data) {
    if (DEBUG === 'true') {
      winstonLogger.info(data);
    }
  }
};
