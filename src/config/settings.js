require('dotenv').config();

module.exports = {

    TokenSigning: {
        jwt_key: process.env.JWT_KEY,
        signing_algorithm: 'HS256',
        expiresIn: 24 * 60
    },
    stripe_api_key: process.env.STRIPE_SECRET_KEY,
}