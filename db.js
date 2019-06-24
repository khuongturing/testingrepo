'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'turing'
});


module.exports = connection;