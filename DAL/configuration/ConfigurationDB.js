require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!');

// connection.query('SELECT * FROM test', function (error, results, fields) {


module.exports = connection;
//     if (error) {
//       console.error(error);
//       return;
//     }
  
//     console.log('Table content:', results);
//   });
// connection.end();
// const mysql = require("mysql");
// const dotenv = require("dotenv");

// dotenv.config()
// const connection = mysql.createConnection(process.env.DATABASE_URL);


// module.exports = connection;
// const Sequelize = require('sequelize');


// const sequelize = new Sequelize('impactaproyecto', 'rut', 'Grupot.Mysql', {
//     host: 'grupot.uy',
//     dialect: 'mysql'
//   });
  
//   // Conexión a la base de datos
//   sequelize.authenticate()
//     .then(() => {
//       console.log('Conexión exitosa a la base de datos');
//     })
//     .catch((error) => {
//       console.error('Error al conectar a la base de datos:', error);
//     });
   // module.exports = sequelize;


// const mysql = require("mysql");

// var con = mysql.createConnection({
//     connectionLimit : 10,
//     host: 'grupot.uy',
//     user: 'rut',
//     password: 'Grupot.Mysql',
//     database: 'impactaproyecto',
//     port: 3306,
//     connectTimeout: 20000 // Tiempo de timeout en milisegundos

// });

// con.connect(function (err) {
//     console.log("Connected!");
//     console.log(con);
//     if (err){
//         console.log("ERROR");
//         console.log(error);
//         throw err;
//     } 
// });

// module.exports = con;
