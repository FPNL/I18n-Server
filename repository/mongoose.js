const Config = require('../config');

const mongoose = require('mongoose');

mongoose.connect(Config.MONGO_DB_URI, {useNewUrlParser: true,  useUnifiedTopology: true });


function mongooseConnectionTest() {
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB 連線失敗:'));
    db.once('open', () => console.log('Mongoose 連線成功...'));
}

module.exports = { mongoose, mongooseConnectionTest };
