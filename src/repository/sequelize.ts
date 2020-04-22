import Sequelize = require('sequelize');

import Config from '../config';

// let sequelize = {};

const sequelize = new Sequelize.Sequelize(Config.DATABASE, Config.USERNAME, Config.PASSWORD, {
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

const sequelizeConnectionTest = async (): Promise<boolean> => {
    try {
        console.log('Sequelize 連線中...');
        await sequelize.authenticate();
        console.log('Sequelize 連線成功 ! ');
        return true;
    } catch (error) {
        console.error('Sequelize 連接失敗 : ', error);
        return false;
    }
}

// const define = () => {
//     return sequelize.define;
// }

export default { sequelize, sequelizeConnectionTest };
