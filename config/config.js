const dotenv = require('dotenv');
dotenv.config()

module.exports = {
  port: process.env.PORT || 8080,
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "shopify_test",
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    logging: false
  },
  production: {
    use_env_variable: "CLEARDB_DATABASE_URL",
    dialect: "mysql"
  }
}
