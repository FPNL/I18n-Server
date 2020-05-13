import Mongoose from 'mongoose';

import * as config from '../config';

function m_connect() {
    Mongoose.connect(config.MONGO_DB_URI + config.MONGO_DB_DATABASE,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            authSource: 'admin',
            useFindAndModify: false
        }
    );
    return Mongoose;
}


async function m_connectionTest() {
    try {
        console.log('mongoose 測試連線...', config.MONGO_DB_URI + config.MONGO_DB_DATABASE);

        const mongooseClient = await m_connect();
        const db = mongooseClient.connection;
        db.on('error', console.error.bind(console, 'MongoDB 連線失敗 : '));
        db.once('open', () => console.log('Mongoose 測試連線成功 ! '));

        // await mongooseClient.disconnect();
        return true;
    } catch (error) {
        return false;
    }
}

export { m_connect, m_connectionTest };
