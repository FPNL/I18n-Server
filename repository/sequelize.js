const Sequelize = require('sequelize');
const Config = require('../config');

// let sequelize = {};

const sequelize = new Sequelize(Config.DATABASE, Config.USERNAME, Config.PASSWORD, {
    host: Config.HOST,
    dialect: Config.DATABASE_TYPE,
    // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
    // This was true by default, but now is false by default
    define: { timestamps: false }
});

// const connect = () => {
//     sequelize = new Sequelize(Config.DATABASE, Config.USERNAME, Config.PASSWORD, {
//         host: Config.HOST,
//         dialect: Config.DATABASE_TYPE,
//         define: { timestamps: false }
//     });
// }

const sequelizeConnectionTest = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('資料庫連線成功...');
        })
        .catch(err => {
            console.error('資料庫連接失敗:', err);
        });
}

// const define = () => {
//     return sequelize.define;
// }

module.exports = { sequelize, sequelizeConnectionTest };
