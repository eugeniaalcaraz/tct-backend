require("dotenv").config();
const mysql = require("mysql");

var con = mysql.createConnection({
    connectionLimit : 10,
    host: 'grupot.uy',
    user: 'rut',
    password: 'Grupot.Mysql',
    database: 'impactaproyecto',
    port: 3306
});

con.connect(function (err) {
    console.log("Connected!");
    if (err) throw err;
});

module.exports = con;
