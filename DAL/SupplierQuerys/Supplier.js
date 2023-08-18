const con = require("../configuration/ConfigurationDB");

function saveSupplier({ idMerchant }) {
    let stringQuery = `SELECT * FROM merchant where id = ${idMerchant}`;
    return new Promise(function (resolve, reject) {
      con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
  