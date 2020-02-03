const mysql2 = require('mysql2');
const mysql = require('mysql');

var con = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"1998",
  database:"dbms",
  port:"42069",
  multipleStatements: true
});
module.exports= con;

  