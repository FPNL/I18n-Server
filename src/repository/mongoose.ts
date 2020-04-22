import Mongoose = require('mongoose');

import Config from '../config';

console.log(Config.MONGO_DB_URI + Config.MONGO_DB_DATABASE);


Mongoose.connect(Config.MONGO_DB_URI + Config.MONGO_DB_DATABASE,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        authSource: 'admin'
    }
);


function mongooseConnectionTest() {
    console.log('MongoDB 連線中...');

    const db = Mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB 連線失敗 : '));
    db.once('open', () => console.log('Mongoose 連線成功 ! '));
}

export default { Mongoose, mongooseConnectionTest };
