require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
    },
    test: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        dialect: 'mysql',
        logging: false,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
    },
};
