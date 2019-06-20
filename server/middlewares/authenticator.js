import jwt from 'jsonwebtoken';
import 'dotenv/config';
import errorResponse from '../helpers/errorResponse';

export default {
  generateToken(user) {
    const token = jwt.sign({ user }, process.env.JWTKEY, {
      expiresIn: process.env.TOKEN_EXPIRATION
    });
    return token;
  },

  confirmToken(req, res, next) {
    let token = req.headers['user-key'];
    if (!token) {
      return res.status(401).json(errorResponse(req, res, 401, 'AUT_01', ' Authorization code is empty', 'authorization code'));
    }
    if (token.split(' ')[0] !== 'Bearer') {
      return res.status(401).json(errorResponse(req, res, 401, 'AUT_03', 'Invalid token supplied', 'authorization code'));
    }
    // eslint-disable-next-line
    token = token.split(' ')[1];
    jwt.verify(token, process.env.JWTKEY, (err, decoded) => {
      if (err) {
        if (err.message.includes('signature')) {
          return res.status(401).json(errorResponse(req, res, 401, 'AUT_03', 'Invalid token supplied', 'authorization code'));
        }
        return res.status(401).json(errorResponse(req, res, 401, 'AUT_03', err.message, 'authorization code'));
      }
      req.user = decoded.user;
      next();
    });
  }
};
