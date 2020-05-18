import Sequelize from 'sequelize';

import * as config from '../config';

function s_connect() {
    return new Sequelize.Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
        host: config.HOST,
        dialect: config.DATABASE_TYPE,
        // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
        // This was true by default, but now is false by default
        define: { timestamps: false },
        logging: config.SEQUELIZE_LOGGING === 'false' ? false : console.log,
    });
}

async function s_connectionTest(): Promise<boolean> {
    try {
        console.log('Sequelize 測試連線中...');
        const sequelize = await s_connect();
        await sequelize.authenticate();
        await sequelize.close();
        console.log('Sequelize 測試連線成功 ! ');
        return true;
    } catch (error) {
        console.error('Sequelize 測試連接失敗 : ', error);
        return false;
    }
};

// const define = () => {
//     return sequelize.define;
// }

// 沒錢買 線上 sql 改用 mongo
// export { s_connect, s_connectionTest };
