const sequelize = require('./sequelize');
const mongoose = require('./mongoose');
const mongo = require('./mongo')

module.exports = { sequelize, mongoose, mongo };

// module.exports.sequelize = sequelize.sequelize

// [MySql]
// const Mysql = require('mysql2');
// const connection = Mysql.createPool({
//     host: HOST,
//     user: USER,
//     password: PASSWORD,
//     database: DATABASE,
//     connectionLimit: CONNECTION_LIMIT,
// });
// module.exports.query = () => {
    // connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    //     if (error) throw error;
    //     console.log('The solution is: ', results[0].solution);
    // });
    // return connection.query;
// }
