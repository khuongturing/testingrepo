/**
 * Configuration for running tests
 */
module.exports = {
  DATABASE_CONFIG: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: process.env.database_password || 'mysqlpass',
    multipleStatements: true
  },
  SERVER: {
    PORT: 3001,
    API_VERSION: 'v1'
  },
  ENABLE_DATADOG_APM: false,
  FORCE_USE_DB: 'turing_test' // Create and use test database
}