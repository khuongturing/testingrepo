const config = require('../config/settings');
const jwt = require('jsonwebtoken');
const Response = require('./responseManager');
const HttpStatus = require('./httpStatus');
const responseMessages = require('../config/responseMessages');

class Utility {
    /**
     * Generates Token to be sent back to client
     * @param {*} data payload
     */
    static generateToken(data) {
        const token = jwt.sign(
            data,
            config.TokenSigning.jwt_key,
            {
                algorithm: config.TokenSigning.signing_algorithm,
            }
        );
        return token;
    }


    /**
     * decdde Token
     * @param {*} token
     */
    static decodeToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                config.TokenSigning.jwt_key,
                {
                    algorithm: config.TokenSigning.signing_algorithm,
                    expiresIn: config.TokenSigning.expiresIn * 60,
                },
                (err, decoded) => {
                    if (err) reject(err);
                    resolve(decoded);
                }
            );
        });
    }

    static validateToken(req, res, next) {
        let token;
        token = req && req.headers && req.headers['user-key']
            ? req.headers['user-key'] : '';

        if(!token) return Response.failure(res, responseMessages.AUTHORIZATION_CODE_EMPTY, HttpStatus.BAD_REQUEST, 'user-key')
        
        let split_token = token.split(' ');
        if(split_token.length > 2 || split_token[0] !== 'Bearer' || !split_token[1]) 
                return Response.failure(res, responseMessages.ACCESS_UNAUTHORIZED, HttpStatus.UNAUTHORIZED, 'user-key');

        return Utility.decodeToken(split_token[1])
            .then((decoded) => {
                if (!decoded)
                    return Response.failure(res, responseMessages.ACCESS_UNAUTHORIZED, HttpStatus.UNAUTHORIZED, 'user-key');

                console.log({decoded})
                req.customer_id = decoded.id;
                req.customer_email= decoded.email;
                return next();
            })
            .catch((err) => {
                console.log(`decoding Error: ${err}`);
                return Response.failure(res, responseMessages.ACCESS_UNAUTHORIZED, HttpStatus.UNAUTHORIZED, 'user-key');
            });
    }


}

module.exports = Utility;
