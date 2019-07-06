import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()
const secret = process.env.SECRET;

/**
* @description: This an authentication method to provide permission for users
*
* @method: jwtVerify
*
* @param {object} req: request parameter
* @param {object} res: response object
* @param {function} next: error response callback
*
* @return {void}
*/
const jwtVerify = (req, res, next) => {
    const tokenWithBearer = req.headers.authorization || req.headers['x-access-token'] ||
        req.header('authorization');
    if (!tokenWithBearer) {
        return res.status(401).json({
            code: 'AUT_01',
            message: 'Authorization code is empty',
            field: 'NoAuth'
        });
    }
    const token = tokenWithBearer.split(' ', 3)[2]
    jwt.verify(token, secret, (error, user) => {
        if (error) {
            if (error.message === 'jwt expired') {
                return res.status(401).json({
                    code: 'AUTH_02',
                    message: 'Access Unauthorized',
                    field: 'NoAuth'

                });
            }
            res.status(401).json({
                code: 'AUT_02',
                message: 'Access Unauthorized',
                field: 'NoAuth'
            });
        }
        req.user = user;
        next();
    });
}

export default jwtVerify;
