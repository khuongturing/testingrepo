const config = require('config')
const mysql = require('promise-mysql')

let dbConfig = config.get('DATABASE_CONFIG')
// For tests
if(config.get('FORCE_USE_DB')) {
  dbConfig = {...dbConfig, ...{database: config.get('FORCE_USE_DB')}}
}

// create a connection pool
const pool = mysql.createPool(dbConfig)

module.exports = pool