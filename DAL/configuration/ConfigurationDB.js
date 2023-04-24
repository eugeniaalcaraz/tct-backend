require("dotenv").config();
const mysql = require("mysql");

var con = mysql.createConnection({
    connectionLimit: 10,
    host: "grupotshangrila.zapto.org",
    user: "grupoort",
    password: "ort2022",
    database: "impactaproyecto",
    port: 5306,
});

con.connect(function (err) {
    if (err) throw err;
});

module.exports = con;
