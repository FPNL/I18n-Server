import Mongoose = require('mongoose');

import config from '../config';

console.log(config.MONGO_DB_URI + config.MONGO_DB_DATABASE);


Mongoose.connect(config.MONGO_DB_URI + config.MONGO_DB_DATABASE,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        authSource: 'admin',
        useFindAndModify: false
    }
);


function mongooseConnectionTest() {
    console.log('MongoDB 連線中...');

    const db = Mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB 連線失敗 : '));
    db.once('open', () => console.log('Mongoose 連線成功 ! '));
}

export default { Mongoose, mongooseConnectionTest };
