import jwt from 'jsonwebtoken';
import httpException from 'src/http/httpException';
import { Customer as CustomerModel } from 'src/domains/models';
import {
  ERROR_CODES,
  JWT_SECRET
} from 'src/config/constants';

const stripTokenBearerString = (tokenString) => {
  const splitArray = tokenString.split(' ');
  const token = splitArray.length > 1 ? splitArray[splitArray.length - 1] : splitArray[0];
  return token;
};

/**
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - handle to the next middleware
 * @return {void}
 */
const verifyToken = (req, res, next) => {
  let token = req.headers['user-key'];

  if (token) {
    token = stripTokenBearerString(token);

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(httpException.handle(ERROR_CODES.AUT_02));
      }

      const user = await CustomerModel.findByPk(decoded.id);
      if (!user) {
        return next(httpException.handle(ERROR_CODES.AUT_02));
      }
      req.decoded = decoded;
      next();
    });
  } else {
    throw httpException.handle(ERROR_CODES.AUT_01);
  }
};

export default verifyToken;
