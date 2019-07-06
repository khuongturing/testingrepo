const prepare = require('mocha-prepare')
const config = require('config')
const fs = require('fs')
const path = require('path')
const mysql = require('promise-mysql')

let dbConfig = config.get('DATABASE_CONFIG')
dbConfig = {...dbConfig, ...{database: null}}

const pool = mysql.createPool(dbConfig)

prepare(async function(done) {
  // create tables and insert data
  await pool.query(fs.readFileSync(path.join(__dirname, '..', 'setup.sql'), 'utf-8'))
  // Read procedures individually as mysql queries do not support DELIMITERS. https://github.com/mysqljs/mysql/issues/1683#issuecomment-308219407
  const procedures = fs.readFileSync(path.join(__dirname, '..', 'procedures.sql'), 'utf-8').split('$$').filter(Boolean)
  for (let procedure of procedures) {
    await pool.query(procedure)
  }
  done()
})

